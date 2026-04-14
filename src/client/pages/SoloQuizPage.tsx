import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { modelenceMutation } from '@modelence/react-query';
import { BookOpen, Trophy, CheckCircle2, XCircle, Clock, Loader2, RotateCcw, Home, Flame, Heart, Lightbulb, Sparkles, Gem, Star, Coins, Hand, Shuffle, LucideIcon } from 'lucide-react';
import { Button } from '@/client/components/ui/Button';

// Bible verses data
type BibleVerse = {
  reference: string;
  text: string;
  category: string;
};

const bibleVerses: BibleVerse[] = [
  // Faith
  { reference: "Hebrews 11:1", text: "Now faith is the substance of things hoped for, the evidence of things not seen.", category: "faith" },
  { reference: "Romans 10:17", text: "So then faith cometh by hearing, and hearing by the word of God.", category: "faith" },
  { reference: "Matthew 17:20", text: "If ye have faith as a grain of mustard seed, ye shall say unto this mountain, Remove hence to yonder place; and it shall remove.", category: "faith" },
  { reference: "Mark 11:24", text: "Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them.", category: "faith" },
  { reference: "James 2:17", text: "Even so faith, if it hath not works, is dead, being alone.", category: "faith" },
  { reference: "2 Corinthians 5:7", text: "For we walk by faith, not by sight.", category: "faith" },
  { reference: "Galatians 2:20", text: "I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me.", category: "faith" },
  { reference: "Ephesians 2:8", text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God.", category: "faith" },

  // Love
  { reference: "John 3:16", text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", category: "love" },
  { reference: "1 Corinthians 13:4", text: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up.", category: "love" },
  { reference: "1 Corinthians 13:13", text: "And now abideth faith, hope, charity, these three; but the greatest of these is charity.", category: "love" },
  { reference: "1 John 4:8", text: "He that loveth not knoweth not God; for God is love.", category: "love" },
  { reference: "Romans 8:38-39", text: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, shall be able to separate us from the love of God.", category: "love" },
  { reference: "John 15:13", text: "Greater love hath no man than this, that a man lay down his life for his friends.", category: "love" },
  { reference: "1 John 4:19", text: "We love him, because he first loved us.", category: "love" },
  { reference: "Matthew 22:37-39", text: "Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind. This is the first and great commandment.", category: "love" },

  // Wisdom
  { reference: "Proverbs 1:7", text: "The fear of the LORD is the beginning of knowledge: but fools despise wisdom and instruction.", category: "wisdom" },
  { reference: "James 1:5", text: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.", category: "wisdom" },
  { reference: "Proverbs 3:5-6", text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.", category: "wisdom" },
  { reference: "Proverbs 4:7", text: "Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding.", category: "wisdom" },
  { reference: "Ecclesiastes 7:12", text: "For wisdom is a defence, and money is a defence: but the excellency of knowledge is, that wisdom giveth life to them that have it.", category: "wisdom" },
  { reference: "Proverbs 9:10", text: "The fear of the LORD is the beginning of wisdom: and the knowledge of the holy is understanding.", category: "wisdom" },
  { reference: "Colossians 3:16", text: "Let the word of Christ dwell in you richly in all wisdom; teaching and admonishing one another.", category: "wisdom" },
  { reference: "Proverbs 16:16", text: "How much better is it to get wisdom than gold! and to get understanding rather to be chosen than silver!", category: "wisdom" },

  // Healing
  { reference: "Jeremiah 17:14", text: "Heal me, O LORD, and I shall be healed; save me, and I shall be saved: for thou art my praise.", category: "healing" },
  { reference: "Isaiah 53:5", text: "But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.", category: "healing" },
  { reference: "Psalm 103:2-3", text: "Bless the LORD, O my soul, and forget not all his benefits: Who forgiveth all thine iniquities; who healeth all thy diseases.", category: "healing" },
  { reference: "James 5:15", text: "And the prayer of faith shall save the sick, and the Lord shall raise him up.", category: "healing" },
  { reference: "3 John 1:2", text: "Beloved, I wish above all things that thou mayest prosper and be in health, even as thy soul prospereth.", category: "healing" },
  { reference: "Exodus 15:26", text: "I am the LORD that healeth thee.", category: "healing" },
  { reference: "Psalm 147:3", text: "He healeth the broken in heart, and bindeth up their wounds.", category: "healing" },
  { reference: "Matthew 9:35", text: "And Jesus went about all the cities and villages, teaching in their synagogues, and preaching the gospel of the kingdom, and healing every sickness and every disease among the people.", category: "healing" },

  // Marriage
  { reference: "Genesis 2:24", text: "Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh.", category: "marriage" },
  { reference: "Ephesians 5:25", text: "Husbands, love your wives, even as Christ also loved the church, and gave himself for it.", category: "marriage" },
  { reference: "Proverbs 18:22", text: "Whoso findeth a wife findeth a good thing, and obtaineth favour of the LORD.", category: "marriage" },
  { reference: "Mark 10:9", text: "What therefore God hath joined together, let not man put asunder.", category: "marriage" },
  { reference: "1 Corinthians 13:7", text: "Beareth all things, believeth all things, hopeth all things, endureth all things.", category: "marriage" },
  { reference: "Ecclesiastes 4:9-10", text: "Two are better than one; because they have a good reward for their labour. For if they fall, the one will lift up his fellow.", category: "marriage" },
  { reference: "Colossians 3:19", text: "Husbands, love your wives, and be not bitter against them.", category: "marriage" },
  { reference: "1 Peter 3:7", text: "Likewise, ye husbands, dwell with them according to knowledge, giving honour unto the wife, as unto the weaker vessel.", category: "marriage" },

  // Grace
  { reference: "Ephesians 2:8-9", text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast.", category: "grace" },
  { reference: "2 Corinthians 12:9", text: "And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness.", category: "grace" },
  { reference: "Romans 5:8", text: "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.", category: "grace" },
  { reference: "Titus 2:11", text: "For the grace of God that bringeth salvation hath appeared to all men.", category: "grace" },
  { reference: "John 1:16", text: "And of his fulness have all we received, and grace for grace.", category: "grace" },
  { reference: "Romans 6:14", text: "For sin shall not have dominion over you: for ye are not under the law, but under grace.", category: "grace" },
  { reference: "Hebrews 4:16", text: "Let us therefore come boldly unto the throne of grace, that we may obtain mercy, and find grace to help in time of need.", category: "grace" },
  { reference: "2 Peter 3:18", text: "But grow in grace, and in the knowledge of our Lord and Saviour Jesus Christ.", category: "grace" },

  // Prosperity
  { reference: "Jeremiah 29:11", text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.", category: "prosperity" },
  { reference: "Philippians 4:19", text: "But my God shall supply all your need according to his riches in glory by Christ Jesus.", category: "prosperity" },
  { reference: "Deuteronomy 8:18", text: "But thou shalt remember the LORD thy God: for it is he that giveth thee power to get wealth.", category: "prosperity" },
  { reference: "Malachi 3:10", text: "Bring ye all the tithes into the storehouse, that there may be meat in mine house, and prove me now herewith, saith the LORD of hosts.", category: "prosperity" },
  { reference: "Joshua 1:8", text: "This book of the law shall not depart out of thy mouth; but thou shalt meditate therein day and night, that thou mayest observe to do according to all that is written therein.", category: "prosperity" },
  { reference: "Psalm 1:3", text: "And he shall be like a tree planted by the rivers of water, that bringeth forth his fruit in his season; his leaf also shall not wither.", category: "prosperity" },
  { reference: "Proverbs 10:22", text: "The blessing of the LORD, it maketh rich, and he addeth no sorrow with it.", category: "prosperity" },
  { reference: "Luke 6:38", text: "Give, and it shall be given unto you; good measure, pressed down, and shaken together, and running over.", category: "prosperity" },

  // Salvation
  { reference: "Romans 10:9", text: "That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.", category: "salvation" },
  { reference: "John 14:6", text: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.", category: "salvation" },
  { reference: "Acts 4:12", text: "Neither is there salvation in any other: for there is none other name under heaven given among men, whereby we must be saved.", category: "salvation" },
  { reference: "Romans 6:23", text: "For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.", category: "salvation" },
  { reference: "John 5:24", text: "Verily, verily, I say unto you, He that heareth my word, and believeth on him that sent me, hath everlasting life.", category: "salvation" },
  { reference: "Acts 16:31", text: "Believe on the Lord Jesus Christ, and thou shalt be saved, and thy house.", category: "salvation" },
  { reference: "Titus 3:5", text: "Not by works of righteousness which we have done, but according to his mercy he saved us.", category: "salvation" },
  { reference: "1 John 5:13", text: "These things have I written unto you that believe on the name of the Son of God; that ye may know that ye have eternal life.", category: "salvation" },
];

// Category info with icons
const categoryInfo: Record<string, { name: string; Icon: LucideIcon }> = {
  faith: { name: 'Faith', Icon: Flame },
  love: { name: 'Love', Icon: Heart },
  wisdom: { name: 'Wisdom', Icon: Lightbulb },
  healing: { name: 'Healing', Icon: Sparkles },
  marriage: { name: 'Marriage', Icon: Gem },
  grace: { name: 'Grace', Icon: Star },
  prosperity: { name: 'Prosperity', Icon: Coins },
  salvation: { name: 'Salvation', Icon: Hand },
  random: { name: 'Random', Icon: Shuffle },
};

type QuizQuestion = {
  id: number;
  verseText: string;
  correctAnswer: string;
  options: string[];
  category: string;
};

const QUESTION_TIME_LIMIT = 15;
const TOTAL_QUESTIONS = 5;

function getVersesByCategory(category: string): BibleVerse[] {
  if (category === 'random') {
    return bibleVerses;
  }
  return bibleVerses.filter(v => v.category === category);
}

function getRandomVerses(category: string, count: number): BibleVerse[] {
  const categoryVerses = getVersesByCategory(category);
  const shuffled = [...categoryVerses].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateWrongAnswers(correctVerse: BibleVerse, count: number = 3): string[] {
  const allVerses = bibleVerses.filter(v => v.reference !== correctVerse.reference);
  const shuffled = [...allVerses].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(v => v.reference);
}

function generateQuestions(category: string, count: number = TOTAL_QUESTIONS): QuizQuestion[] {
  const verses = getRandomVerses(category, count);

  return verses.map((verse, index) => {
    const wrongAnswers = generateWrongAnswers(verse, 3);
    const options = [verse.reference, ...wrongAnswers].sort(() => Math.random() - 0.5);

    return {
      id: index + 1,
      verseText: verse.text,
      correctAnswer: verse.reference,
      options,
      category: verse.category,
    };
  });
}

function calculateScore(answerTimeMs: number, isCorrect: boolean): number {
  if (!isCorrect) return 0;
  const baseScore = 100;
  const maxTimeBonus = 50;
  const maxTimeMs = QUESTION_TIME_LIMIT * 1000;
  const timeBonus = Math.max(0, Math.floor(maxTimeBonus * (1 - answerTimeMs / maxTimeMs)));
  return baseScore + timeBonus;
}

export default function SoloQuizPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIME_LIMIT);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [gameStatus, setGameStatus] = useState<'loading' | 'playing' | 'finished'>('loading');
  const [hasRecordedResult, setHasRecordedResult] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Mutation to record game result to leaderboard
  const { mutate: recordGameResult } = useMutation({
    ...modelenceMutation('leaderboard.recordGameResult'),
  });

  // Record game result when finished
  useEffect(() => {
    if (gameStatus === 'finished' && !hasRecordedResult && score > 0) {
      recordGameResult({
        score,
        correctAnswers,
        totalAnswers: TOTAL_QUESTIONS,
      });
      setHasRecordedResult(true);
    }
  }, [gameStatus, hasRecordedResult, score, correctAnswers, recordGameResult]);

  useEffect(() => {
    if (!category) {
      navigate('/play/solo');
      return;
    }
    const generatedQuestions = generateQuestions(category, TOTAL_QUESTIONS);
    setQuestions(generatedQuestions);
    setQuestionStartTime(Date.now());
    setGameStatus('playing');
  }, [category, navigate]);

  useEffect(() => {
    if (gameStatus !== 'playing' || showResult) {
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStatus, showResult, currentQuestionIndex]);

  const handleTimeUp = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setShowResult(true);
  }, []);

  const handleSelectAnswer = (answer: string) => {
    if (selectedAnswer || showResult) return;
    const answerTime = Date.now() - questionStartTime;
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    const earnedScore = calculateScore(answerTime, isCorrect);
    setSelectedAnswer(answer);
    setShowResult(true);
    if (isCorrect) {
      setScore(prev => prev + earnedScore);
      setCorrectAnswers(prev => prev + 1);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= questions.length) {
      setGameStatus('finished');
      return;
    }
    setCurrentQuestionIndex(nextIndex);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(QUESTION_TIME_LIMIT);
    setQuestionStartTime(Date.now());
  };

  const handleRestart = () => {
    const generatedQuestions = generateQuestions(category || 'random', TOTAL_QUESTIONS);
    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCorrectAnswers(0);
    setTimeLeft(QUESTION_TIME_LIMIT);
    setQuestionStartTime(Date.now());
    setGameStatus('playing');
    setHasRecordedResult(false);
  };

  const currentCategory = categoryInfo[category || 'random'] || categoryInfo.random;
  const CategoryIcon = currentCategory.Icon;

  // Loading state
  if (gameStatus === 'loading' || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Preparing your quiz...</p>
        </div>
      </div>
    );
  }

  // Game finished
  if (gameStatus === 'finished') {
    const percentage = Math.round((correctAnswers / TOTAL_QUESTIONS) * 100);
    let message = '';
    let messageColor = '';

    if (percentage >= 80) {
      message = 'Excellent! You really know your Scripture!';
      messageColor = 'text-green-400';
    } else if (percentage >= 60) {
      message = 'Great job! Keep testing yourself!';
      messageColor = 'text-blue-400';
    } else if (percentage >= 40) {
      message = 'Good effort! Practice makes perfect.';
      messageColor = 'text-yellow-400';
    } else {
      message = 'Keep practicing! You\'ll memorize more over time.';
      messageColor = 'text-blue-400';
    }

    return (
      <div className="min-h-screen bg-[#0a0a12] text-white overflow-hidden relative" style={{ fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif" }}>
        {/* Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <Trophy className="w-24 h-24 text-yellow-400 mb-6" />
          <h1 className="text-5xl font-bold mb-2">Quiz Complete!</h1>
          <p className={`text-xl mb-8 ${messageColor}`}>{message}</p>

          {/* Score Card */}
          <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CategoryIcon className="w-10 h-10 text-white" />
              </div>
              <p className="text-gray-400">{currentCategory.name} Category</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-4xl font-bold text-blue-400">{score}</p>
                <p className="text-sm text-gray-400">Total Score</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-4xl font-bold text-blue-400">{correctAnswers}/{TOTAL_QUESTIONS}</p>
                <p className="text-sm text-gray-400">Correct</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{percentage}%</p>
              <p className="text-sm text-gray-400">Accuracy</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={handleRestart}
              className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3 flex items-center gap-2 font-semibold"
            >
              <RotateCcw className="w-5 h-5" />
              Quiz Again
            </Button>
            <Link to="/play/solo">
              <Button className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 font-semibold">
                Change Topic
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 flex items-center gap-2 font-semibold">
                <Home className="w-5 h-5" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white overflow-hidden relative" style={{ fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif" }}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <div className="relative z-20 px-6 py-4 flex justify-between items-center border-b border-white/10">
        <Link to="/dashboard" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-blue-400">Verz</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Category Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
            <CategoryIcon className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">{currentCategory.name}</span>
          </div>

          {/* Score */}
          <div className="text-center">
            <p className="text-xs text-gray-400">Score</p>
            <p className="font-bold text-blue-400">{score}</p>
          </div>

          {/* Question Progress */}
          <div className="text-center">
            <p className="text-xs text-gray-400">Question</p>
            <p className="font-bold">{currentQuestionIndex + 1} / {TOTAL_QUESTIONS}</p>
          </div>

          {/* Timer */}
          <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 ${
            timeLeft <= 3 ? 'border-red-500 text-red-400' : 'border-blue-500 text-blue-400'
          }`}>
            <span className="text-xl font-bold">{timeLeft}</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Question Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8">
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Which book is this from?
            </p>
            <p className="text-2xl md:text-3xl font-medium leading-relaxed">
              "{currentQuestion.verseText}"
            </p>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = currentQuestion.correctAnswer === option;

              let buttonClass = 'bg-white/10 border-white/20 hover:bg-white/20';

              if (showResult) {
                if (isCorrect) {
                  buttonClass = 'bg-green-500/30 border-green-500 text-green-300';
                } else if (isSelected && !isCorrect) {
                  buttonClass = 'bg-red-500/30 border-red-500 text-red-300';
                }
              } else if (isSelected) {
                buttonClass = 'bg-blue-500/30 border-blue-500';
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={showResult}
                  className={`
                    p-6 rounded-2xl border-2 transition-all text-left
                    disabled:cursor-not-allowed
                    ${buttonClass}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-lg font-semibold flex-1">{option}</span>
                    {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-400" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-400" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result & Next Button */}
          {showResult && (
            <div className="text-center">
              {selectedAnswer ? (
                <div className={`mb-6 p-4 rounded-xl ${
                  selectedAnswer === currentQuestion.correctAnswer ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  <p className="text-2xl font-bold flex items-center justify-center gap-2">
                    {selectedAnswer === currentQuestion.correctAnswer ? (
                      <>
                        <CheckCircle2 className="w-7 h-7 text-green-400" />
                        Correct!
                      </>
                    ) : (
                      <>
                        <XCircle className="w-7 h-7 text-red-400" />
                        Wrong!
                      </>
                    )}
                  </p>
                  {selectedAnswer === currentQuestion.correctAnswer && (
                    <p className="text-blue-400">+{calculateScore(Date.now() - questionStartTime, true)} points</p>
                  )}
                  {selectedAnswer !== currentQuestion.correctAnswer && (
                    <p className="text-gray-400 mt-2">
                      Correct answer: <span className="text-green-400">{currentQuestion.correctAnswer}</span>
                    </p>
                  )}
                </div>
              ) : (
                <div className="mb-6 p-4 rounded-xl bg-yellow-500/20">
                  <p className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Clock className="w-7 h-7 text-yellow-400" />
                    Time's Up!
                  </p>
                  <p className="text-gray-400 mt-2">
                    Correct answer: <span className="text-green-400">{currentQuestion.correctAnswer}</span>
                  </p>
                </div>
              )}

              <Button
                onClick={handleNextQuestion}
                className="bg-blue-500 hover:bg-blue-400 px-12 py-4 text-lg"
              >
                {currentQuestionIndex + 1 >= TOTAL_QUESTIONS ? 'See Results' : 'Next Question'}
              </Button>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex gap-2">
              {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full ${
                    i < currentQuestionIndex ? 'bg-blue-500' :
                    i === currentQuestionIndex ? 'bg-blue-500/50' :
                    'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
