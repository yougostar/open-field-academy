import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  GraduationCap, Clock, BookOpen, ChevronRight
} from "lucide-react";

interface Slide {
  title: string;
  content: string;
  emoji: string;
  tip?: string;
}

interface Lecture {
  id: string;
  title: string;
  subject: string;
  classLevel: string;
  duration: string;
  description: string;
  emoji: string;
  slides: Slide[];
}

const lectures: Lecture[] = [
  {
    id: "math-addition-1",
    title: "Fun with Addition",
    subject: "Maths",
    classLevel: "Class 1",
    duration: "5 min",
    description: "Learn to add numbers using fun examples like fruits and toys!",
    emoji: "➕",
    slides: [
      { title: "What is Addition?", content: "Addition means putting things together! When we add, we get more. If you have 2 apples and your friend gives you 3 more apples, you now have 5 apples! We write this as 2 + 3 = 5.", emoji: "🍎", tip: "Use your fingers to count!" },
      { title: "Adding with Toys", content: "Imagine you have 4 toy cars. Your mother buys you 2 more toy cars. How many cars do you have now? Count them: 1, 2, 3, 4, 5, 6! So 4 + 2 = 6. You have 6 toy cars!", emoji: "🚗", tip: "Draw the toys on paper to help you count." },
      { title: "The Plus Sign", content: "The plus sign looks like this: +. It tells us to add two numbers together. When you see a plus sign, it means 'and more'. So 3 + 1 means 3 and 1 more, which equals 4!", emoji: "✨" },
      { title: "Adding Zero", content: "When we add zero to any number, the number stays the same! 5 + 0 = 5. Zero means nothing, so adding nothing changes nothing. This is a special rule in maths!", emoji: "0️⃣", tip: "Zero is like an invisible friend — it doesn't change the group!" },
      { title: "Let's Practice!", content: "Try these: What is 1 + 1? It's 2! What is 3 + 2? It's 5! What is 4 + 4? It's 8! Great job! You are now an addition star!", emoji: "⭐" },
    ],
  },
  {
    id: "science-plants-1",
    title: "How Plants Grow",
    subject: "Science",
    classLevel: "Class 2",
    duration: "6 min",
    description: "Discover the amazing journey of a tiny seed becoming a big plant!",
    emoji: "🌱",
    slides: [
      { title: "The Tiny Seed", content: "Every big tree starts as a tiny seed! Seeds come in many shapes and sizes. A mango seed is big, but a mustard seed is very tiny. Inside every seed is a baby plant waiting to grow!", emoji: "🌰", tip: "Collect different seeds from your kitchen and compare their sizes." },
      { title: "What Plants Need", content: "Plants need four things to grow: sunlight, water, air, and soil. Sunlight gives them energy, water keeps them healthy, air helps them breathe, and soil gives them food and a place to stand.", emoji: "☀️" },
      { title: "Growing Roots", content: "When a seed gets water, it starts to grow! First, tiny roots come out and go down into the soil. Roots are like straws that drink water from the ground. They also hold the plant firmly in place.", emoji: "🌿", tip: "Put a bean seed in a wet cotton ball and watch roots grow in a few days!" },
      { title: "The Stem and Leaves", content: "After the roots, a small stem pushes up through the soil. Then leaves appear! Leaves are very important — they make food for the plant using sunlight. This is called photosynthesis!", emoji: "🍃" },
      { title: "Flowers and Fruits", content: "When the plant is big enough, it makes flowers. Flowers are beautiful and they help the plant make seeds. Some flowers turn into fruits like mangoes, apples, and tomatoes. And inside the fruits? More seeds!", emoji: "🌸", tip: "Cut open a tomato and count the seeds inside!" },
    ],
  },
  {
    id: "english-abc-1",
    title: "The Alphabet Song",
    subject: "English",
    classLevel: "Class 1",
    duration: "4 min",
    description: "Learn the English alphabet with fun words and sounds!",
    emoji: "🔤",
    slides: [
      { title: "A to F", content: "A is for Apple — a yummy red fruit! B is for Ball — we play with it! C is for Cat — soft and fluffy! D is for Dog — our best friend! E is for Elephant — the biggest animal! F is for Fish — it swims in water!", emoji: "🍎" },
      { title: "G to L", content: "G is for Grapes — sweet and juicy! H is for Hat — we wear it on our head! I is for Ice cream — cold and delicious! J is for Jug — it holds water! K is for Kite — it flies in the sky! L is for Lion — the king of the jungle!", emoji: "🦁" },
      { title: "M to R", content: "M is for Moon — it shines at night! N is for Nest — where birds live! O is for Orange — round and tasty! P is for Parrot — a colorful bird! Q is for Queen — she wears a crown! R is for Rainbow — so many colors!", emoji: "🌈" },
      { title: "S to Z", content: "S is for Sun — it gives us light! T is for Tree — it gives us shade! U is for Umbrella — keeps us dry! V is for Van — it carries things! W is for Watch — tells us the time! X is for Xylophone — a musical instrument! Y is for Yak — a big hairy animal! Z is for Zebra — black and white stripes!", emoji: "🦓", tip: "Point to objects around you and say their first letter!" },
    ],
  },
  {
    id: "hindi-ginti-1",
    title: "हिंदी गिनती (1-10)",
    subject: "Hindi",
    classLevel: "Class 1",
    duration: "4 min",
    description: "Learn counting from 1 to 10 in Hindi with everyday examples!",
    emoji: "🔢",
    slides: [
      { title: "एक से तीन (1-3)", content: "एक means 1 — एक सूरज आसमान में चमकता है! दो means 2 — हमारे दो हाथ होते हैं! तीन means 3 — तिरंगे झंडे में तीन रंग होते हैं — केसरिया, सफ़ेद, और हरा!", emoji: "🇮🇳", tip: "अपनी उंगलियों पर गिनो!" },
      { title: "चार से छह (4-6)", content: "चार means 4 — कुर्सी के चार पैर होते हैं! पाँच means 5 — एक हाथ में पाँच उंगलियाँ होती हैं! छह means 6 — कीड़े के छह पैर होते हैं!", emoji: "✋" },
      { title: "सात से दस (7-10)", content: "सात means 7 — इंद्रधनुष में सात रंग होते हैं! आठ means 8 — मकड़ी के आठ पैर होते हैं! नौ means 9 — नौ ग्रह हमारे सौर मंडल में हैं! दस means 10 — दोनों हाथों में मिलाकर दस उंगलियाँ!", emoji: "🌈" },
      { title: "अभ्यास करें!", content: "अब बोलो: एक, दो, तीन, चार, पाँच, छह, सात, आठ, नौ, दस! शाबाश! तुम हिंदी में गिनती बोल सकते हो! अब उल्टी गिनती करो: दस, नौ, आठ, सात, छह, पाँच, चार, तीन, दो, एक!", emoji: "🎉", tip: "रोज़ सुबह हिंदी में गिनती बोलो!" },
    ],
  },
  {
    id: "science-animals-2",
    title: "Animals and Their Homes",
    subject: "Science",
    classLevel: "Class 2",
    duration: "6 min",
    description: "Learn where different animals live and why they choose those homes!",
    emoji: "🏠",
    slides: [
      { title: "Why Animals Need Homes", content: "Just like us, animals need homes to stay safe! Their homes protect them from rain, sun, and other animals. Different animals make different kinds of homes based on where they live.", emoji: "🏡", tip: "Think about why your home keeps you safe!" },
      { title: "Birds Make Nests", content: "Birds build nests using twigs, grass, leaves, and even feathers! They build nests on trees, rooftops, or even inside holes in walls. Mother birds lay eggs in the nest and keep them warm until baby birds hatch!", emoji: "🐦" },
      { title: "Animals That Dig", content: "Rabbits dig burrows underground — these are tunnels with rooms inside! Ants build anthills with many tiny rooms for their family. Rats also live in burrows. Underground homes keep them cool in summer and warm in winter!", emoji: "🐰" },
      { title: "Water Homes", content: "Fish live in water — rivers, ponds, and oceans are their homes! Frogs live near ponds. Turtles carry their home on their back — their shell! Crabs live in the sand near the sea.", emoji: "🐟", tip: "Visit a pond and see how many water animals you can spot!" },
      { title: "Forest Homes", content: "Lions live in dens in the forest. Monkeys live on trees. Bears sleep in caves during winter — this is called hibernation! Snakes hide in holes between rocks. Every animal has a perfect home!", emoji: "🦁" },
    ],
  },
  {
    id: "math-shapes-2",
    title: "Shapes All Around Us",
    subject: "Maths",
    classLevel: "Class 2",
    duration: "5 min",
    description: "Discover circles, squares, triangles and rectangles in everyday life!",
    emoji: "🔷",
    slides: [
      { title: "What Are Shapes?", content: "Shapes are the outlines of things around us! Everything you see has a shape. A ball is round, a book is rectangular, and a slice of pizza is triangular. Let's learn about the basic shapes!", emoji: "📐" },
      { title: "Circle — The Round Shape", content: "A circle is perfectly round with no corners! Wheels, coins, clocks, and the sun are all circles. A circle has no straight lines — it's one smooth curved line that goes all the way around!", emoji: "⭕", tip: "Find 5 circle-shaped things in your room!" },
      { title: "Square and Rectangle", content: "A square has 4 equal sides and 4 corners. A window can be a square! A rectangle is like a stretched square — it has 4 sides but two sides are longer. Books, doors, and phones are rectangles!", emoji: "📱" },
      { title: "Triangle — Three Sides", content: "A triangle has 3 sides and 3 corners. A slice of pizza, a party hat, and a mountain shape are all triangles! The roof of a house is often a triangle shape. Tri means three!", emoji: "🔺" },
      { title: "Shapes Hunt!", content: "Now go on a shapes hunt! Look at your plate — it's a circle! Look at the door — it's a rectangle! Look at a sandwich cut diagonally — it's a triangle! Shapes are everywhere once you start looking!", emoji: "🔍", tip: "Draw your favourite shapes and colour them!" },
    ],
  },
  {
    id: "social-festivals-3",
    title: "Festivals of India",
    subject: "Social Science",
    classLevel: "Class 3",
    duration: "7 min",
    description: "Celebrate the colourful and joyful festivals of our beautiful country!",
    emoji: "🎊",
    slides: [
      { title: "India — Land of Festivals", content: "India is called the land of festivals because we celebrate so many! People of different religions and cultures live together and celebrate each other's festivals. Festivals bring happiness, togetherness, and lots of yummy food!", emoji: "🇮🇳" },
      { title: "Diwali — Festival of Lights", content: "Diwali is the festival of lights! We light diyas and candles, burst crackers, eat sweets, and wear new clothes. It celebrates the return of Lord Ram to Ayodhya. We decorate our homes with rangoli and lights!", emoji: "🪔", tip: "Make a beautiful rangoli with coloured powder or flower petals!" },
      { title: "Holi — Festival of Colours", content: "Holi is the festival of colours! We play with coloured powders and water, dance, and eat special sweets like gujiya. It celebrates the victory of good over evil. On Holi, everyone is a friend!", emoji: "🎨" },
      { title: "Eid and Christmas", content: "Eid is celebrated by Muslims after the holy month of Ramzan. Families pray together, share food, and give gifts. Christmas is celebrated by Christians on 25th December — the birthday of Jesus Christ. People decorate Christmas trees and exchange gifts!", emoji: "🎄" },
      { title: "Harvest Festivals", content: "Different parts of India celebrate harvest differently! Pongal in Tamil Nadu, Baisakhi in Punjab, Bihu in Assam, and Makar Sankranti across many states. Farmers thank nature for good crops. People fly kites and share food!", emoji: "🪁", tip: "Ask your grandparents about festivals from their childhood!" },
      { title: "Unity in Diversity", content: "The most beautiful thing about India is that we respect all festivals! A Hindu friend celebrates Eid, a Muslim friend enjoys Diwali, and everyone loves Christmas! This is called 'Unity in Diversity' — we are different but we are one!", emoji: "🤝" },
    ],
  },
  {
    id: "english-story-3",
    title: "The Thirsty Crow",
    subject: "English",
    classLevel: "Class 3",
    duration: "5 min",
    description: "A classic story that teaches us to never give up and think smart!",
    emoji: "🐦‍⬛",
    slides: [
      { title: "A Hot Summer Day", content: "Once upon a time, on a very hot summer day, a crow was flying over a dry land. He was very, very thirsty. His throat was dry and he really needed water. He flew and flew, looking everywhere for water.", emoji: "☀️" },
      { title: "Finding the Pot", content: "After flying for a long time, the crow found a pot! He was so happy! He flew down quickly and looked inside the pot. There was water inside, but it was at the very bottom. The crow's beak could not reach the water!", emoji: "🏺" },
      { title: "Thinking Hard", content: "The crow was sad. He thought and thought. Should he give up? No! He looked around and saw some small stones on the ground. Then he got a brilliant idea! What if he put the stones into the pot?", emoji: "💡", tip: "When you face a problem, stop and think before giving up!" },
      { title: "The Smart Plan", content: "The crow picked up one stone and dropped it into the pot. Plop! Then another stone. Plop! And another! Slowly, slowly, the water started rising higher and higher in the pot. The crow kept going!", emoji: "🪨" },
      { title: "The Happy Ending", content: "Finally, the water rose high enough for the crow to drink! He drank the cool water and felt so happy. The moral of the story is: Where there is a will, there is a way! If you try hard and think smart, you can solve any problem!", emoji: "🎉", tip: "Try this at home with a glass of water and some pebbles!" },
    ],
  },
  {
    id: "math-multiplication-4",
    title: "Multiplication Made Easy",
    subject: "Maths",
    classLevel: "Class 4",
    duration: "7 min",
    description: "Learn multiplication tables through patterns and fun tricks!",
    emoji: "✖️",
    slides: [
      { title: "What is Multiplication?", content: "Multiplication is a quick way of adding the same number many times! Instead of saying 3 + 3 + 3 + 3, we can say 3 × 4 = 12. It means 3 taken 4 times. Multiplication makes counting faster!", emoji: "⚡" },
      { title: "The 2 Times Table", content: "The 2 times table is like counting by 2s: 2, 4, 6, 8, 10, 12, 14, 16, 18, 20. Easy trick: any number times 2 is just double that number! 7 × 2 = 14 because double of 7 is 14!", emoji: "✌️", tip: "Count the shoes in your house by 2s!" },
      { title: "The 5 Times Table", content: "The 5 times table always ends in 0 or 5! Look: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50. If you can count by 5s, you already know your 5 times table! Think of counting five-rupee coins.", emoji: "🪙" },
      { title: "The 9 Times Table Trick", content: "Here's a magic trick for the 9 times table! Hold up all 10 fingers. To find 9 × 3, put down finger number 3. You have 2 fingers on the left and 7 on the right. The answer is 27! This works for 9 × 1 through 9 × 10!", emoji: "🪄", tip: "Try the finger trick for 9 × 7. Put down finger 7. Count: 6 left, 3 right = 63!" },
      { title: "Multiplication in Real Life", content: "Multiplication is everywhere! If 1 packet has 6 biscuits, then 4 packets have 6 × 4 = 24 biscuits! If each row in class has 8 students and there are 5 rows, that's 8 × 5 = 40 students!", emoji: "🍪" },
      { title: "Practice Makes Perfect", content: "The secret to knowing multiplication tables is practice! Say them out loud, write them down, and quiz yourself. Start with 2s, 5s, and 10s — they're the easiest. Then learn 3s, 4s, and so on. You'll be a multiplication champion!", emoji: "🏆" },
    ],
  },
  {
    id: "science-water-cycle-4",
    title: "The Water Cycle",
    subject: "Science",
    classLevel: "Class 4",
    duration: "6 min",
    description: "Follow a drop of water on its amazing journey through nature!",
    emoji: "💧",
    slides: [
      { title: "Water is Everywhere!", content: "Water covers most of our Earth! It's in oceans, rivers, lakes, and even in the air around us. But did you know? The same water keeps going around and around in a cycle. The water you drink today might have been in a river long ago!", emoji: "🌍" },
      { title: "Evaporation — Water Goes Up!", content: "When the sun heats water in rivers, lakes, and oceans, the water turns into tiny invisible drops called water vapour. This is called evaporation! The water vapour rises up into the sky. You can see this when puddles disappear on a sunny day!", emoji: "☀️", tip: "Put a plate of water in the sun and check it after a few hours!" },
      { title: "Condensation — Clouds Form!", content: "When water vapour goes high up in the sky, it gets cold. The cold air turns the vapour back into tiny water droplets. These droplets stick together and form clouds! This process is called condensation. Clouds are actually made of tiny water drops!", emoji: "☁️" },
      { title: "Precipitation — Rain Falls!", content: "When clouds get too heavy with water droplets, the water falls back down as rain! This is called precipitation. Sometimes, if it's very cold, the water falls as snow or hail. Rain fills up rivers, lakes, and goes into the ground!", emoji: "🌧️" },
      { title: "The Cycle Continues!", content: "The rain water flows into rivers and oceans, gets heated by the sun again, evaporates, forms clouds, and rains again! This is the water cycle — it never stops! It has been going on for millions of years, giving us fresh water to drink!", emoji: "🔄", tip: "Draw the water cycle and label each step: evaporation, condensation, precipitation!" },
    ],
  },
  {
    id: "social-maps-5",
    title: "Understanding Maps",
    subject: "Social Science",
    classLevel: "Class 5",
    duration: "7 min",
    description: "Learn to read maps and discover what those symbols and colours mean!",
    emoji: "🗺️",
    slides: [
      { title: "What is a Map?", content: "A map is a drawing of a place as seen from above, like a bird looking down! Maps help us find places, measure distances, and understand the world. They show mountains, rivers, roads, cities, and much more — all on a flat piece of paper!", emoji: "🗺️" },
      { title: "Parts of a Map", content: "Every good map has a title that tells us what area it shows. It has a compass rose that shows North, South, East, and West. It has a scale that helps us measure real distances. And it has a legend or key that explains the symbols!", emoji: "🧭", tip: "Always look for North on a map first — it's usually at the top!" },
      { title: "Colours on Maps", content: "Maps use colours to show different things! Blue shows water — oceans, rivers, and lakes. Green shows plains and forests. Brown shows mountains and hills. Yellow or orange shows deserts. White on top of mountains means snow!", emoji: "🎨" },
      { title: "Symbols and the Legend", content: "Maps use small pictures called symbols. A tiny airplane means an airport. A small cross means a hospital. Dotted lines show state borders. Thick lines show highways. The legend box on the map explains what each symbol means!", emoji: "🔑" },
      { title: "Types of Maps", content: "There are many types of maps! A political map shows countries and states with different colours. A physical map shows mountains, rivers, and plains. A road map shows highways and streets. A weather map shows temperatures and rainfall!", emoji: "📍" },
      { title: "Maps in Everyday Life", content: "We use maps every day! Google Maps helps us navigate roads. Weather apps show weather maps. In school, we learn about India's states using political maps. Explorers and travelers always carry maps. Now you can read them too!", emoji: "📱", tip: "Find India on a world map and name the countries next to it!" },
    ],
  },
  {
    id: "math-fractions-5",
    title: "Fractions Made Fun",
    subject: "Maths",
    classLevel: "Class 5",
    duration: "7 min",
    description: "Understand fractions using pizza, chocolate, and everyday examples!",
    emoji: "🍕",
    slides: [
      { title: "What is a Fraction?", content: "A fraction is a part of a whole! When you cut a roti into 2 equal pieces and eat 1 piece, you ate 1/2 (one-half) of the roti. The top number (numerator) tells how many parts you have. The bottom number (denominator) tells the total parts!", emoji: "🫓" },
      { title: "Half, Quarter, and Three-Quarters", content: "1/2 means one out of two equal parts — like sharing a chocolate equally with a friend. 1/4 means one out of four equal parts — like cutting a pizza into 4 slices and eating 1. 3/4 means three out of four parts — that's most of the pizza!", emoji: "🍫", tip: "Cut a piece of paper into 4 equal parts. Colour 3 parts — that's 3/4!" },
      { title: "Equal Parts are Important!", content: "For a fraction to make sense, the parts must be EQUAL! If you cut a cake into 3 pieces but one piece is huge and two are tiny, that's not 1/3 each. The pieces must be the same size for fractions to work correctly!", emoji: "🎂" },
      { title: "Comparing Fractions", content: "Which is bigger: 1/2 or 1/4? Think of it this way: if you share a pizza between 2 friends, each gets more than if you share it between 4 friends! So 1/2 is bigger than 1/4. When the denominator is bigger, each piece is smaller!", emoji: "⚖️" },
      { title: "Fractions in Daily Life", content: "Fractions are everywhere! Half an hour is 30 minutes. A quarter kilogram of sugar is 250 grams. When a cricket match is half over, it means half the overs are done. You use fractions every day without even knowing it!", emoji: "⏰" },
      { title: "Adding Simple Fractions", content: "To add fractions with the same denominator, just add the top numbers! 1/4 + 2/4 = 3/4. Think of pizza slices: 1 slice plus 2 slices out of 4 total slices = 3 slices out of 4. Easy!", emoji: "🧮", tip: "Draw circles, divide them into parts, and shade fractions to see them clearly!" },
    ],
  },
];

const subjectColors: Record<string, string> = {
  Maths: "bg-primary/10 text-primary border-primary/20",
  Science: "bg-green-500/10 text-green-700 border-green-500/20",
  English: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  Hindi: "bg-orange-500/10 text-orange-700 border-orange-500/20",
  "Social Science": "bg-purple-500/10 text-purple-700 border-purple-500/20",
};

const VideoLectures = () => {
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [filterSubject, setFilterSubject] = useState("All");
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const subjects = ["All", "Maths", "Science", "English", "Hindi", "Social Science"];

  const filteredLectures = filterSubject === "All"
    ? lectures
    : lectures.filter((l) => l.subject === filterSubject);

  useEffect(() => {
    return () => {
      synthRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    if (selectedLecture && isPlaying && !isMuted) {
      speak(selectedLecture.slides[currentSlide]);
    }
  }, [currentSlide]);

  const speak = (slide: Slide) => {
    synthRef.current.cancel();
    const text = `${slide.title}. ${slide.content}${slide.tip ? `. Tip: ${slide.tip}` : ""}`;
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.85;
    utt.pitch = 1.1;
    utt.lang = selectedLecture?.subject === "Hindi" ? "hi-IN" : "en-IN";
    utt.onend = () => {
      if (selectedLecture && currentSlide < selectedLecture.slides.length - 1) {
        setTimeout(() => setCurrentSlide((p) => p + 1), 800);
      } else {
        setIsPlaying(false);
      }
    };
    utteranceRef.current = utt;
    synthRef.current.speak(utt);
  };

  const handlePlay = () => {
    if (!selectedLecture) return;
    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (!isMuted) speak(selectedLecture.slides[currentSlide]);
    }
  };

  const handleNext = () => {
    if (!selectedLecture || currentSlide >= selectedLecture.slides.length - 1) return;
    synthRef.current.cancel();
    setCurrentSlide((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentSlide <= 0) return;
    synthRef.current.cancel();
    setCurrentSlide((p) => p - 1);
    if (isPlaying && !isMuted && selectedLecture) {
      setTimeout(() => speak(selectedLecture.slides[currentSlide - 1]), 100);
    }
  };

  const handleMute = () => {
    if (!isMuted) synthRef.current.cancel();
    setIsMuted(!isMuted);
  };

  const openLecture = (lecture: Lecture) => {
    synthRef.current.cancel();
    setSelectedLecture(lecture);
    setCurrentSlide(0);
    setIsPlaying(false);
  };

  const closeLecture = () => {
    synthRef.current.cancel();
    setSelectedLecture(null);
    setCurrentSlide(0);
    setIsPlaying(false);
  };

  const slide = selectedLecture?.slides[currentSlide];
  const progress = selectedLecture
    ? ((currentSlide + 1) / selectedLecture.slides.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar onSearch={() => {}} />
        <main className="p-4 md:p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">🎬 Video Lectures</h1>
            <p className="text-muted-foreground mt-1">
              Interactive narrated lessons — tap play and listen while you learn!
            </p>
          </div>

          {/* Subject Filter */}
          <div className="flex flex-wrap gap-2">
            {subjects.map((s) => (
              <Button
                key={s}
                variant={filterSubject === s ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterSubject(s)}
              >
                {s}
              </Button>
            ))}
          </div>

          {/* Lecture Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredLectures.map((lecture) => (
              <Card
                key={lecture.id}
                className="group cursor-pointer hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
                onClick={() => openLecture(lecture)}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="text-5xl text-center py-4 bg-muted/50 rounded-xl group-hover:scale-105 transition-transform">
                    {lecture.emoji}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={subjectColors[lecture.subject]}>
                      {lecture.subject}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      {lecture.classLevel}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-foreground text-lg line-clamp-2">{lecture.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{lecture.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {lecture.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> {lecture.slides.length} slides
                    </span>
                  </div>
                  <Button className="w-full gap-2" variant="default">
                    <Play className="h-4 w-4" /> Start Lecture
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Lecture Player Dialog */}
          <Dialog open={!!selectedLecture} onOpenChange={(open) => !open && closeLecture()}>
            <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
              {selectedLecture && slide && (
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <DialogHeader className="p-4 pb-2 border-b border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={subjectColors[selectedLecture.subject]}>
                        {selectedLecture.subject}
                      </Badge>
                      <Badge variant="outline">{selectedLecture.classLevel}</Badge>
                    </div>
                    <DialogTitle>{selectedLecture.title}</DialogTitle>
                    <DialogDescription>
                      Slide {currentSlide + 1} of {selectedLecture.slides.length}
                    </DialogDescription>
                    <Progress value={progress} className="h-1.5 mt-2" />
                  </DialogHeader>

                  {/* Slide Content */}
                  <ScrollArea className="flex-1 p-6">
                    <div className="text-center space-y-4">
                      <div className="text-6xl">{slide.emoji}</div>
                      <h2 className="text-2xl font-bold text-foreground">{slide.title}</h2>
                      <p className="text-base leading-relaxed text-foreground/90 max-w-lg mx-auto whitespace-pre-line">
                        {slide.content}
                      </p>
                      {slide.tip && (
                        <div className="mt-4 mx-auto max-w-md bg-primary/5 border border-primary/20 rounded-xl p-4 text-left">
                          <p className="text-sm font-semibold text-primary mb-1">💡 Tip</p>
                          <p className="text-sm text-foreground/80">{slide.tip}</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Controls */}
                  <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-center gap-3">
                    <Button variant="outline" size="icon" onClick={handleMute}>
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentSlide === 0}>
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button size="lg" onClick={handlePlay} className="gap-2 px-6">
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      {isPlaying ? "Pause" : "Play"}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNext}
                      disabled={currentSlide >= selectedLecture.slides.length - 1}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default VideoLectures;
