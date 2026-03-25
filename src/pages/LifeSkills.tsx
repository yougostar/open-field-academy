import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Heart, Users, Lightbulb, Shield, Smile, Target, CheckCircle2, BookOpen } from "lucide-react";

interface Lesson {
  title: string;
  content: string;
  activity?: string;
  tip?: string;
}

interface Skill {
  icon: typeof Heart;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  lessons: Lesson[];
}

const skills: Skill[] = [
  {
    icon: Heart,
    title: "Emotional Intelligence",
    description: "Learn to understand and manage your emotions effectively",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    lessons: [
      {
        title: "Understanding Your Feelings",
        content: "Emotions are like signals that tell us how we feel about things happening around us. Happy, sad, angry, scared — all feelings are okay to have! The important thing is learning what each feeling means and why we feel it.",
        activity: "Draw faces showing 5 different emotions you felt today. Write one sentence about what caused each emotion.",
        tip: "It's okay to feel sad or angry sometimes. Naming your feeling is the first step to feeling better."
      },
      {
        title: "Managing Anger",
        content: "Anger is a normal emotion, but how we express it matters. When we feel angry, our body gives us signs — clenched fists, fast heartbeat, or a hot face. Learning to notice these signs helps us pause before reacting.",
        activity: "Practice the 'Stop, Breathe, Think' method: Stop what you're doing, take 5 deep breaths, then think of a calm way to respond.",
        tip: "Counting to 10 slowly when angry gives your brain time to calm down."
      },
      {
        title: "Showing Empathy",
        content: "Empathy means understanding how someone else feels by imagining yourself in their situation. When a friend is sad, empathy helps you comfort them. It's like putting on someone else's shoes to understand their walk.",
        activity: "Think of a time when a friend was upset. Write down what they might have been feeling and what you could say to help.",
        tip: "Listening carefully without interrupting is one of the best ways to show empathy."
      },
      {
        title: "Building Self-Confidence",
        content: "Self-confidence means believing in yourself and your abilities. Everyone is good at different things! Confidence grows when you try new things, practice, and celebrate small successes.",
        activity: "Write down 5 things you are good at. Share one of them with a friend or family member today.",
        tip: "Making mistakes is how we learn. Every expert was once a beginner!"
      },
      {
        title: "Dealing with Fear",
        content: "Fear is our brain's way of keeping us safe, but sometimes we feel afraid of things that aren't dangerous, like speaking in class or trying something new. Facing small fears helps us become braver over time.",
        activity: "Write about one thing that scares you. Break it into tiny steps and try the first small step this week.",
        tip: "Being brave doesn't mean having no fear — it means doing things even when you're scared."
      },
      {
        title: "Expressing Gratitude",
        content: "Gratitude means being thankful for the good things in your life — a kind friend, a yummy meal, or a sunny day. Practicing gratitude makes us happier and helps us notice the positive things around us.",
        activity: "Start a gratitude journal. Write 3 things you're thankful for every night before bed.",
        tip: "Saying 'thank you' to people who help you spreads happiness to them too!"
      },
      {
        title: "Handling Disappointment",
        content: "Sometimes things don't go the way we planned — we might lose a game, get a low grade, or miss an event. Disappointment is natural, but we can learn to bounce back by focusing on what we can do next.",
        activity: "Think of a recent disappointment. Write what happened, how you felt, and one positive thing that came from it.",
        tip: "Every setback is a setup for a comeback. Keep trying!"
      },
      {
        title: "Being Kind to Yourself",
        content: "Self-kindness means treating yourself the way you would treat a good friend. Instead of being harsh when you make a mistake, talk to yourself with encouragement and understanding.",
        activity: "Write a kind letter to yourself about something you're struggling with, as if you were writing to your best friend.",
        tip: "Replace 'I can't do this' with 'I can't do this yet, but I'm learning.'"
      },
    ],
  },
  {
    icon: Users,
    title: "Communication Skills",
    description: "Master the art of expressing yourself and listening to others",
    color: "text-primary",
    bgColor: "bg-primary/10",
    lessons: [
      {
        title: "Active Listening",
        content: "Active listening means giving your full attention to the person speaking. It involves looking at them, nodding, and not interrupting. Good listeners remember what was said and can ask thoughtful questions.",
        activity: "Practice with a partner: one person talks for 2 minutes about their favorite hobby while the other only listens. Then the listener repeats back what they heard.",
        tip: "Put away distractions like phones or toys when someone is talking to you."
      },
      {
        title: "Speaking Clearly",
        content: "Good communication starts with speaking clearly. This means using a steady pace, proper volume, and organizing your thoughts before speaking. Practice helps you express ideas so others understand easily.",
        activity: "Choose a topic you love and explain it to a family member in exactly 1 minute. Ask them if they understood everything.",
        tip: "Take a small pause before answering a question — it gives your brain time to organize thoughts."
      },
      {
        title: "Body Language",
        content: "More than half of what we communicate comes from our body, not our words! Crossed arms might show you're upset, while a smile shows friendliness. Learning to read and use body language helps us communicate better.",
        activity: "Play a game: act out 5 emotions using only your face and body (no words!). See if your friends can guess each one.",
        tip: "Making eye contact shows the other person that you're interested in what they're saying."
      },
      {
        title: "Asking Good Questions",
        content: "Asking questions shows curiosity and helps us learn. Good questions start with 'what,' 'how,' or 'why' and encourage the other person to share more. They make conversations interesting and meaningful.",
        activity: "Interview a family member about their childhood. Prepare 5 interesting questions before you start.",
        tip: "There's no such thing as a silly question. If you're wondering, others probably are too!"
      },
      {
        title: "Saying No Politely",
        content: "It's okay to say no when something doesn't feel right or when you're too busy. The key is to be honest, kind, and firm. You can say no without hurting someone's feelings by explaining your reason gently.",
        activity: "Practice 3 polite ways to say no: 'Thank you, but I can't right now,' 'I'd rather not, but thanks for asking,' 'Maybe another time.'",
        tip: "Saying no to one thing means saying yes to something else that matters more to you."
      },
      {
        title: "Working in a Team",
        content: "Teamwork means working together towards a common goal. Good team members share ideas, listen to others, take turns, and support each other. Every person's contribution matters!",
        activity: "Do a group project: build something using paper and tape with 2-3 friends. Each person must contribute at least one idea.",
        tip: "A good team player celebrates others' successes, not just their own."
      },
      {
        title: "Resolving Conflicts",
        content: "Disagreements happen, even between friends. Conflict resolution means finding a fair solution that both sides can accept. It involves listening to each other, staying calm, and looking for a compromise.",
        activity: "Role-play a scenario where two friends want to play different games. Practice finding a solution that makes both happy.",
        tip: "Use 'I feel...' statements instead of 'You always...' to express your side without blaming."
      },
      {
        title: "Giving and Receiving Compliments",
        content: "A sincere compliment can brighten someone's day! Learning to give specific, genuine compliments and to accept them gracefully is an important social skill that builds positive relationships.",
        activity: "Give 3 genuine compliments today — one to a friend, one to a family member, and one to yourself.",
        tip: "When someone compliments you, simply say 'Thank you!' instead of brushing it off."
      },
      {
        title: "Storytelling",
        content: "Storytelling is one of the most powerful communication skills. A good story has a beginning, middle, and end, with interesting details that keep the listener engaged. Everyone has stories worth sharing!",
        activity: "Tell a story about your best day ever. Include details about what you saw, heard, and felt to make it vivid.",
        tip: "Use expressions and change your voice tone to make your stories come alive."
      },
      {
        title: "Digital Communication",
        content: "In today's world, we also communicate through messages, emails, and video calls. Being clear, polite, and thoughtful in digital messages is just as important as face-to-face communication.",
        activity: "Write a polite email or message to a teacher or relative asking about their day. Use proper greetings and sign-off.",
        tip: "Re-read your message before sending — make sure it sounds kind and clear."
      },
    ],
  },
  {
    icon: Lightbulb,
    title: "Critical Thinking",
    description: "Develop problem-solving and analytical thinking abilities",
    color: "text-warning",
    bgColor: "bg-warning/10",
    lessons: [
      {
        title: "What is Critical Thinking?",
        content: "Critical thinking means carefully examining information before believing it or making decisions. Instead of just accepting what we hear, we ask questions, look for evidence, and think about different possibilities.",
        activity: "Read a short news headline and write down 3 questions you would ask to find out if it's true.",
        tip: "Being a critical thinker doesn't mean being negative — it means being curious and careful."
      },
      {
        title: "Solving Problems Step by Step",
        content: "Every problem can be broken down into smaller, manageable steps. First, understand the problem. Then, think of possible solutions. Try the best one, and if it doesn't work, try another. This approach works for math, science, and everyday life!",
        activity: "Think of a problem you're facing (like organizing your study space). Write down 3 possible solutions and pick the best one to try.",
        tip: "Drawing or writing down a problem often makes it easier to solve."
      },
      {
        title: "Fact vs. Opinion",
        content: "A fact is something that can be proven true (like 'Water boils at 100°C'). An opinion is what someone believes or feels (like 'Summer is the best season'). Knowing the difference helps us make better decisions.",
        activity: "Read 10 sentences and sort them into 'Fact' and 'Opinion' columns. Discuss your answers with a friend.",
        tip: "Words like 'best,' 'worst,' 'should,' and 'I think' often signal an opinion."
      },
      {
        title: "Asking 'Why?' and 'How?'",
        content: "Curious people ask 'why' and 'how' to understand things deeply. Instead of just memorizing answers, try to understand the reason behind them. This makes learning more fun and helps you remember better!",
        activity: "Pick any everyday object (like a pencil). Ask and try to answer: Why is it shaped this way? How is it made? Why this material?",
        tip: "The smartest people in history were the ones who kept asking 'why?'"
      },
      {
        title: "Making Good Decisions",
        content: "We make hundreds of decisions every day! Good decision-making means thinking about the consequences of each choice. Consider: What are my options? What could happen with each choice? Which choice matches my values?",
        activity: "Think of a decision you need to make. Create a pros and cons list for each option before choosing.",
        tip: "When unsure, ask yourself: 'Will I be happy with this choice tomorrow? Next week? Next year?'"
      },
      {
        title: "Creative Problem Solving",
        content: "Sometimes the best solutions are the most creative ones! Thinking 'outside the box' means looking at problems from new angles. Brainstorming, combining ideas, and imagining unusual solutions can lead to breakthroughs.",
        activity: "Challenge: How many uses can you think of for a paper clip? Try to list at least 15 different uses in 5 minutes!",
        tip: "There's no wrong answer in brainstorming. Wild ideas often lead to the best solutions."
      },
      {
        title: "Understanding Cause and Effect",
        content: "Every action has a consequence. Understanding cause and effect helps us predict what might happen and make better choices. If you study hard (cause), you'll likely do well on the test (effect).",
        activity: "Create a cause-and-effect chain: Start with 'I wake up late' and write 5 effects that follow from that one cause.",
        tip: "Before acting, ask yourself: 'What will happen if I do this?'"
      },
      {
        title: "Evaluating Information Sources",
        content: "Not everything we read or hear is accurate. Learning to check whether information comes from a reliable source is a crucial skill. Look for who wrote it, when, and whether other trusted sources say the same thing.",
        activity: "Find the same news story from 3 different sources. Compare them — do they say the same things? What's different?",
        tip: "If something sounds too amazing or too scary to be true, it probably needs more checking."
      },
      {
        title: "Logical Reasoning",
        content: "Logical reasoning is thinking in an organized, step-by-step way. It's like solving a puzzle — each piece connects to the next. 'If A is true, and B follows from A, then B must be true.'",
        activity: "Solve this: All fruits have seeds. An apple is a fruit. Does an apple have seeds? Create 3 similar logic puzzles of your own.",
        tip: "Practice puzzles, riddles, and brain teasers to sharpen your logical thinking."
      },
      {
        title: "Seeing Different Perspectives",
        content: "The same situation can look very different depending on who's looking at it. Understanding different viewpoints helps us be fairer, more empathetic, and better problem-solvers.",
        activity: "Read a story and write about it from two different characters' points of view. How does each one see the events?",
        tip: "Before disagreeing with someone, try to honestly understand their point of view first."
      },
      {
        title: "Pattern Recognition",
        content: "Patterns are everywhere — in nature, math, music, and daily life. Recognizing patterns helps us predict what comes next and understand how things work. It's a superpower for learning!",
        activity: "Look for patterns around you: in floor tiles, leaf arrangements, or number sequences. Draw or describe 3 patterns you find.",
        tip: "When studying, look for patterns in how information is organized — it makes memorizing much easier."
      },
      {
        title: "Learning from Mistakes",
        content: "Mistakes are actually one of the best ways to learn! When something goes wrong, instead of giving up, ask: 'What went wrong? What can I do differently next time?' This mindset turns failures into stepping stones.",
        activity: "Write about a mistake you made and what you learned from it. Share it with someone — you might help them avoid the same mistake!",
        tip: "Scientists often make hundreds of failed experiments before a breakthrough. Each failure taught them something valuable."
      },
    ],
  },
  {
    icon: Shield,
    title: "Digital Safety",
    description: "Stay safe online and protect your digital identity",
    color: "text-info",
    bgColor: "bg-info/10",
    lessons: [
      {
        title: "Personal Information Protection",
        content: "Your personal information — full name, address, phone number, school name — should be kept private online. Sharing too much can put you and your family at risk. Only share personal details with trusted adults.",
        activity: "Make a list of information that is SAFE to share online and information that should stay PRIVATE. Discuss with a parent.",
        tip: "If a website asks for your address or phone number, always check with a parent first."
      },
      {
        title: "Creating Strong Passwords",
        content: "A strong password is like a strong lock on your door. It should be at least 8 characters long, mix letters, numbers, and symbols, and never include your name or birthday. Different accounts should have different passwords.",
        activity: "Create a strong password using this method: Think of a sentence you love, take the first letter of each word, and add numbers and symbols.",
        tip: "Never share your passwords with friends — only with your parents or guardians."
      },
      {
        title: "Recognizing Online Tricks",
        content: "Some people online try to trick you with fake messages, too-good-to-be-true offers, or scary warnings. These are called scams or phishing. Learning to spot them keeps you safe.",
        activity: "Look at example messages and identify which ones are real and which are scams. Discuss the warning signs with your class.",
        tip: "If a message says 'You won a prize!' but you didn't enter a contest, it's almost certainly a scam."
      },
      {
        title: "Cyberbullying: What to Do",
        content: "Cyberbullying is when someone uses technology to be mean, spread rumors, or embarrass others. If it happens to you, don't respond — save the evidence, block the person, and tell a trusted adult immediately.",
        activity: "Create a poster about how to handle cyberbullying with the steps: Don't Respond → Save Evidence → Block → Tell an Adult.",
        tip: "Being kind online is just as important as being kind in person. Your words matter everywhere."
      },
      {
        title: "Safe Social Media Use",
        content: "Social media can be fun for connecting with friends, but it's important to use it wisely. Keep your accounts private, think before posting, and remember that anything shared online can stay there forever.",
        activity: "Before posting anything, use the THINK test: Is it True? Is it Helpful? Is it Inspiring? Is it Necessary? Is it Kind?",
        tip: "If you wouldn't say it to someone's face, don't post it online."
      },
      {
        title: "Screen Time Balance",
        content: "Spending too much time on screens can affect your sleep, eyesight, and physical health. Balance screen time with outdoor play, reading, family time, and hobbies. Your body and mind need variety!",
        activity: "Track your screen time for one day. Then plan a 'screen-free hour' filled with fun offline activities.",
        tip: "The 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds to rest your eyes."
      },
    ],
  },
  {
    icon: Smile,
    title: "Mental Wellness",
    description: "Build resilience and maintain positive mental health",
    color: "text-success",
    bgColor: "bg-success/10",
    lessons: [
      {
        title: "Understanding Mental Health",
        content: "Mental health is about how we think, feel, and handle life's challenges. Just like we take care of our body by eating well and exercising, we need to take care of our mind too. It's okay to not feel okay sometimes.",
        activity: "Create a 'feelings thermometer' from 1-10. Check in with yourself each morning and evening for a week.",
        tip: "Talking about your feelings isn't weakness — it's one of the strongest things you can do."
      },
      {
        title: "Breathing and Relaxation",
        content: "Deep breathing is a simple but powerful tool to calm your mind and body. When we're stressed, our breathing becomes fast and shallow. Slow, deep breaths signal our brain that we're safe.",
        activity: "Try 'Box Breathing': Breathe in for 4 counts, hold for 4 counts, breathe out for 4 counts, hold for 4 counts. Repeat 5 times.",
        tip: "You can practice deep breathing anywhere — before a test, during an argument, or whenever you feel overwhelmed."
      },
      {
        title: "Building Resilience",
        content: "Resilience is the ability to bounce back from tough times. Like a rubber ball that springs back when dropped, resilient people recover from setbacks. Resilience isn't something you're born with — it's a skill you can build!",
        activity: "Think of a tough time you went through. Write about what helped you get through it and what you learned.",
        tip: "Every challenge you overcome makes you a little bit stronger for the next one."
      },
      {
        title: "The Power of Positive Thinking",
        content: "Our thoughts affect how we feel. Negative thoughts like 'I'll never be good enough' can make us feel sad and give up. Replacing them with positive but realistic thoughts like 'I'm improving every day' helps us feel better and try harder.",
        activity: "Write down 3 negative thoughts you sometimes have. Next to each, write a positive replacement thought.",
        tip: "Your brain believes what you tell it. Feed it positive, encouraging messages!"
      },
      {
        title: "Healthy Habits for a Happy Mind",
        content: "Physical activity, good sleep, healthy food, and spending time with loved ones all boost our mental health. These habits create a strong foundation for feeling good every day.",
        activity: "Create a daily 'Wellness Checklist' with: 30 min exercise, 8 hours sleep, healthy meals, time with friends/family, and one fun activity.",
        tip: "Even a 10-minute walk can improve your mood. Movement is medicine for the mind!"
      },
      {
        title: "Mindfulness and Being Present",
        content: "Mindfulness means paying full attention to what's happening right now, without worrying about the past or future. It helps us enjoy good moments more and handle tough moments with calmness.",
        activity: "Try a 5-minute mindfulness exercise: Sit quietly and notice 5 things you can see, 4 you can hear, 3 you can touch, 2 you can smell, and 1 you can taste.",
        tip: "You don't need to sit still to be mindful. You can be mindful while eating, walking, or even brushing your teeth!"
      },
      {
        title: "When and How to Ask for Help",
        content: "Asking for help is a sign of wisdom, not weakness. If you're feeling sad for a long time, having trouble sleeping, or feeling overwhelmed, talking to a trusted adult — parent, teacher, or counselor — can make a big difference.",
        activity: "Identify 3 trusted adults you can talk to when you need help. Write their names and why you trust them.",
        tip: "You don't have to face tough times alone. There are people who care about you and want to help."
      },
      {
        title: "Managing Stress",
        content: "Stress happens when we feel too much pressure — from homework, tests, friendships, or family issues. A little stress can motivate us, but too much can make us sick. Learning to manage stress keeps us healthy.",
        activity: "Create a personal 'Stress Relief Toolkit' — a list of 10 activities that help you relax (like drawing, playing music, going for a walk).",
        tip: "When feeling stressed, do one thing at a time. Multitasking actually increases stress!"
      },
      {
        title: "Celebrating Small Wins",
        content: "We often focus on big achievements and forget to celebrate small ones. Finished your homework? That's a win! Helped a friend? Win! Tried something new? Huge win! Recognizing small successes builds confidence and happiness.",
        activity: "At the end of each day this week, write down 3 small wins you achieved. Notice how it makes you feel.",
        tip: "Progress, not perfection, is what matters. Every step forward counts!"
      },
    ],
  },
  {
    icon: Target,
    title: "Goal Setting",
    description: "Learn to set and achieve your personal and academic goals",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    lessons: [
      {
        title: "What Are Goals and Why Do They Matter?",
        content: "A goal is something you want to achieve in the future. Goals give us direction, motivation, and a sense of purpose. Without goals, it's like going on a journey without knowing where you want to go!",
        activity: "Write down 3 things you want to achieve: one this week, one this month, and one this year.",
        tip: "Writing down your goals makes you 42% more likely to achieve them!"
      },
      {
        title: "SMART Goals",
        content: "SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound. Instead of saying 'I want to do better in math,' a SMART goal is: 'I will practice 3 math problems every day for the next month to improve my test score by 10%.'",
        activity: "Turn these vague goals into SMART goals: 'Read more books,' 'Get healthier,' 'Be a better student.'",
        tip: "The more specific your goal, the clearer your path to achieving it."
      },
      {
        title: "Breaking Big Goals into Small Steps",
        content: "Big goals can feel overwhelming, but breaking them into small, manageable steps makes them achievable. Think of it like climbing stairs — you reach the top one step at a time, not in one giant leap.",
        activity: "Choose a big goal and break it into 5-10 small action steps. Put them in order and start with step 1 today.",
        tip: "Focus on the next step, not the whole staircase. Progress happens one step at a time."
      },
      {
        title: "Creating an Action Plan",
        content: "An action plan is your roadmap to reaching your goal. It includes what you'll do, when you'll do it, what resources you need, and how you'll track progress. Planning makes success more likely!",
        activity: "Create a weekly action plan for one of your goals. Include daily tasks, materials needed, and checkpoints.",
        tip: "Review your action plan every Sunday evening and adjust it for the upcoming week."
      },
      {
        title: "Staying Motivated",
        content: "Motivation is what keeps us going when things get tough. It helps to remember WHY your goal matters to you, celebrate small progress, find a goal buddy, and visualize how great it will feel to achieve your goal.",
        activity: "Create a 'motivation board' — a poster with pictures, quotes, and reminders of why your goals matter to you.",
        tip: "On days when you don't feel motivated, do just 5 minutes of work on your goal. Starting is often the hardest part!"
      },
      {
        title: "Tracking Your Progress",
        content: "Tracking progress helps you see how far you've come and what still needs to be done. You can use charts, checklists, journals, or apps. Seeing progress — even small amounts — keeps you motivated!",
        activity: "Create a progress tracker for your current goal. It could be a chart, a habit tracker, or a journal. Update it daily.",
        tip: "Don't compare your progress to others. Compare yourself to who you were yesterday."
      },
      {
        title: "Dealing with Setbacks",
        content: "Setbacks are a normal part of working toward any goal. The key is to see them as temporary, learn from them, and adjust your plan. Every successful person has faced and overcome obstacles.",
        activity: "Write about a setback you've experienced. Answer: What happened? What did I learn? How will I adjust my plan?",
        tip: "A setback is a setup for a comeback. Adjust your plan, not your goal."
      },
    ],
  },
];

const LifeSkills = () => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar onSearch={() => {}} />
        
        <main className="p-4 md:p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Heart className="h-8 w-8 text-primary" />
              Life Skills
            </h1>
            <p className="text-muted-foreground mt-1">
              Essential skills for personal growth and success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-elevated transition-all hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-2xl ${skill.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`h-8 w-8 ${skill.color}`} />
                    </div>
                    <CardTitle>{skill.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Badge variant="secondary">{skill.lessons.length} Lessons</Badge>
                      <Button size="sm" onClick={() => setSelectedSkill(skill)}>
                        Start Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>

      {/* Skill Detail Dialog */}
      <Dialog open={!!selectedSkill} onOpenChange={(open) => !open && setSelectedSkill(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] p-0">
          {selectedSkill && (
            <>
              <DialogHeader className="p-6 pb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${selectedSkill.bgColor} flex items-center justify-center`}>
                    <selectedSkill.icon className={`h-6 w-6 ${selectedSkill.color}`} />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedSkill.title}</DialogTitle>
                    <p className="text-sm text-muted-foreground">{selectedSkill.lessons.length} lessons</p>
                  </div>
                </div>
              </DialogHeader>
              <ScrollArea className="max-h-[65vh] px-6 pb-6">
                <Accordion type="single" collapsible className="w-full">
                  {selectedSkill.lessons.map((lesson, i) => (
                    <AccordionItem key={i} value={`lesson-${i}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-sm font-medium">Lesson {i + 1}: {lesson.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pl-6">
                        <p className="text-sm leading-relaxed text-foreground/90">{lesson.content}</p>
                        
                        {lesson.activity && (
                          <div className="rounded-lg bg-primary/5 border border-primary/10 p-3 space-y-1">
                            <p className="text-xs font-semibold text-primary flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Activity
                            </p>
                            <p className="text-sm text-foreground/80">{lesson.activity}</p>
                          </div>
                        )}
                        
                        {lesson.tip && (
                          <div className="rounded-lg bg-warning/5 border border-warning/10 p-3 space-y-1">
                            <p className="text-xs font-semibold text-warning flex items-center gap-1">
                              💡 Tip
                            </p>
                            <p className="text-sm text-foreground/80">{lesson.tip}</p>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LifeSkills;
