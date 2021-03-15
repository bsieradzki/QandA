using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Dapper;
using static Dapper.SqlMapper;
using QandA.Models;

namespace QandA.Data
{
    public class DataRepository : IDataRepository
    {
        private readonly string _connectionString;

        public DataRepository(IConfiguration configuration)
        {
            _connectionString = configuration["ConnectionStrings:DefaultConnection"];
        }
        public AnswerGetResponse GetAnswer(int answerId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                return connection.QueryFirstOrDefault<AnswerGetResponse>(@"EXEC dbo.Answer_Get_ByAnswerId @AnswerId = @AnswerId",
                    new { AnswerId = answerId });
            }
        }

        public QuestionGetSingleResponse GetQuestion(int questionId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                //this implementation makes two (2) round trips to the db
                //var question = connection.QuerySingleOrDefault<QuestionGetSingleResponse>(@"EXEC dbo.Question_GetSingle @QuestionId = @QuestionId",
                //    new { QuestionId = questionId });
                //if (question != null)
                //{
                //    question.Answers = connection.Query<AnswerGetResponse>(@"EXEC dbo.Answer_Get_ByQuestionId @QuestionId = @QuestionId",
                //        new { QuestionId = questionId });
                //}
                //return question;

                //we will now use another feature of Dapper, multi-requests where Dapper will make multiple requests in a single round trip
                using (GridReader results =
                    connection.QueryMultiple(
                        @"EXEC dbo.Question_GetSingle @QuestionId = @QuestionId;
                          EXEC dbo.Answer_Get_ByQuestionId @QuestionId = @QuestionId",
                            new {QuestionId = questionId}
                        )
                    )
                {
                    var question = results.Read<QuestionGetSingleResponse>().FirstOrDefault();
                    if (question != null)
                    {
                        question.Answers = results.Read<AnswerGetResponse>().ToList();
                    }
                    return question;
                }
            }
        }

        public IEnumerable<QuestionGetManyResponse> GetQuestions()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                return connection.Query<QuestionGetManyResponse>(@"EXEC dbo.Question_GetMany");
            }
        }

        public IEnumerable<QuestionGetManyResponse> GetQuestionsWithAnswers()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                //the implementation below demonstrates the N+1 problem where we iterate thru each result and issue another
                //query...below this we will make a single round trip that returns all the data flattened
                //we will then use Dapper's 'multi-mapping' feature to map the results to our object hierarchical structure...

                //var questions = connection.Query<QuestionGetManyResponse>(@"EXEC dbo.Question_GetMany");
                //foreach (var question in questions)
                //{
                //    question.Answers = connection.Query<AnswerGetResponse>(
                //        @"EXEC dbo.Answer_Get_ByQuestionId @QuestionId = @QuestionId",
                //        new { QuestionId = question.QuestionId }
                //        ).ToList();
                //}

                //so the problem here is that there is no mapping...next try below
                //var questions = connection.Query<QuestionGetManyResponse>(@"EXEC dbo.Question_GetMany_WithAnswers");

                var questionDictionary = new Dictionary<int, QuestionGetManyResponse>();
                return connection
                    .Query<
                    QuestionGetManyResponse,
                    AnswerGetResponse,
                    QuestionGetManyResponse>(
                        @"EXEC dbo.Question_GetMany_WithAnswers",
                        map: (q, a) =>
                        {
                            QuestionGetManyResponse question;

                            if (!questionDictionary.TryGetValue(q.QuestionId, out question))
                            {
                                question = q;
                                question.Answers = new List<AnswerGetResponse>();
                                questionDictionary.Add(question.QuestionId, question);
                            }
                            question.Answers.Add(a);
                            return question;
                        },
                        splitOn: "QuestionId"
                        )
                    .Distinct()
                    .ToList();
                //return questions;
            }
        }

        public IEnumerable<QuestionGetManyResponse> GetQuestionsBySearch(string search)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                return connection.Query<QuestionGetManyResponse>(@"EXEC dbo.Question_GetMany_BySearch @Search = @Search",
                    new { Search = search }
                    );
            }
        }

        public IEnumerable<QuestionGetManyResponse> GetQuestionBySearchWithPaging(String search, int pageNumber, int pageSize)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var parameters = new
                {
                    Search = search,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };
                return connection.Query<QuestionGetManyResponse>(@"EXEC dbo.Question_GetMany_BySearch_WithPaging 
                        @Search = @Search, @PageNumber = @PageNumber, @PageSize = @PageSize", parameters);
            }
        }

        public IEnumerable<QuestionGetManyResponse> GetUnansweredQuestions()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                return connection.Query<QuestionGetManyResponse>(@"EXEC dbo.Question_GetUnanswered");
            }
        }

        public bool QuestionExists(int questionId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                return connection.QueryFirst<bool>(@"EXEC dbo.Question_Exists @QuestionId = @QuestionId",
                    new { QuestionId = questionId });
            }
        }

        public QuestionGetSingleResponse PostQuestion(QuestionPostFullRequest question)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                var questionId = connection.QueryFirst<int>(
                    @"EXEC dbo.Question_Post
                    @Title = @Title,
                    @Content = @Content,
                    @UserId = @UserId,
                    @UserName = @UserName,
                    @Created = @Created",
                    question
                    );

                return GetQuestion(questionId);
            }
        }

        public QuestionGetSingleResponse PutQuestion(int questionId, QuestionPutRequest question)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                connection.Execute(@"EXEC dbo.Question_Put @QuestionId = @QuestionId, @Title = @Title, @Content = @Content",
                    new {QuestionId = questionId, question.Title, question.Content}
                    );
                return GetQuestion(questionId);
            }
        }

        public void DeleteQuestion(int questionId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                connection.Execute(@"EXEC dbo.Question_Delete @QuestionId = @QuestionId",
                    new { QuestionId = questionId });
            }
        }

        public AnswerGetResponse PostAnswer(AnswerPostFullRequest answer)
        {
            using (var connnection = new SqlConnection(_connectionString))
            {
                connnection.Open();
                return connnection.QueryFirst<AnswerGetResponse>(@"EXEC dbo.Answer_Post @QuestionId = @QuestionId,
                    @Content = @Content, @UserId = @UserId, @UserName = @UserName, @Created = @Created",
                    answer);
            }
        }


    }
}
