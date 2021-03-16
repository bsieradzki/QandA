using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using QandA.Data;
using QandA.Models;
using Microsoft.AspNetCore.Authorization;

namespace QandA.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly IDataRepository _dataRepository;
        private readonly IQuestionCache _questionCache;

        public QuestionsController(IDataRepository dataRepository, IQuestionCache questionCache)
        {
            _dataRepository = dataRepository;
            _questionCache = questionCache;
        }

        [HttpGet]
        public IEnumerable<QuestionGetManyResponse> GetQuestions(string search, bool includeAnswers, int page=1, int pageSize=20)
        {
            if (string.IsNullOrWhiteSpace(search))
            {
                if (includeAnswers)
                {
                    return _dataRepository.GetQuestionsWithAnswers();
                }
                else
                {
                    return _dataRepository.GetQuestions();
                }
            }
            else
            {
                return _dataRepository.GetQuestionBySearchWithPaging(search, page, pageSize);
            }
        }

        [HttpGet("unanswered")]
        public async Task<IEnumerable<QuestionGetManyResponse>> GetUnansweredQuestions()
        {
            return await _dataRepository.GetUnansweredQuestionsAsync();
        }

        [HttpGet("{questionId}")]
        public ActionResult<QuestionGetSingleResponse> GetQuestion(int questionId)
        {
            var question = _questionCache.Get(questionId);

            if (question == null)
            {
                question = _dataRepository.GetQuestion(questionId);

                if (question == null)
                {
                    return NotFound();
                }

                _questionCache.Set(question);
            }
            return question;
        }

        [Authorize]
        [HttpPost]
        public ActionResult<QuestionGetSingleResponse> PostQuestion(QuestionPostRequest questionPostRequest)
        {
            var savedQuestion = _dataRepository.PostQuestion(new QuestionPostFullRequest
            {
                Title = questionPostRequest.Title,
                Content = questionPostRequest.Content,
                UserId = "1",
                UserName = "some test user",
                Created = DateTime.UtcNow
            });
            return CreatedAtAction(nameof(GetQuestion),
                new { questionId = savedQuestion.QuestionId },
                savedQuestion);
        }

        [Authorize(Policy = "MustBeQuestionAuthor")]
        [HttpPut("{questionId}")]
        public ActionResult<QuestionGetSingleResponse> PutQuestion(int questionId, QuestionPutRequest questionPutRequest)
        {
            var question = _dataRepository.GetQuestion(questionId);
            if (question == null)
            {
                return NotFound();
            }
            questionPutRequest.Title = string.IsNullOrEmpty(questionPutRequest.Title) ? question.Title : questionPutRequest.Title;
            questionPutRequest.Content = string.IsNullOrEmpty(questionPutRequest.Content) ? question.Content : questionPutRequest.Content;
            var savedQuestion = _dataRepository.PutQuestion(questionId, questionPutRequest);

            //remove the edited quesiton from the cache
            _questionCache.Remove(questionId);
            
            return savedQuestion;
        }

        [Authorize(Policy = "MustBeQuestionAuthor")]
        [Authorize]
        [HttpDelete("{questionId}")]
        public ActionResult DeleteQuestion(int questionId)
        {
            bool exists = _dataRepository.QuestionExists(questionId);
            if (!exists)
            {
                return NotFound();
            }
            _dataRepository.DeleteQuestion(questionId);
            
            //remove the deleted quesiton from the cache
            _questionCache.Remove(questionId);
            return NoContent();
        }

        [Authorize]
        [HttpPost("answer")]
        public ActionResult<AnswerGetResponse> PostAnswer(AnswerPostRequest answerPostRequest)
        {
            bool exists = _dataRepository.QuestionExists(answerPostRequest.QuestionId.Value);
            if (!exists)
            {
                return NotFound();
            }
            var savedAnswer = _dataRepository.PostAnswer(new AnswerPostFullRequest
            {
                QuestionId = answerPostRequest.QuestionId.Value,
                Content = answerPostRequest.Content,
                UserId = "1",
                UserName = "another test user",
                Created = DateTime.UtcNow
            });

            //remove the question from the cache when posting an answer
            _questionCache.Remove(answerPostRequest.QuestionId.Value);

            return savedAnswer;
        }
    }
}
