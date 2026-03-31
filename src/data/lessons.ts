import type { LessonDetail } from "@/components/LessonDetailDialog";
import mathImage from "@/assets/feature-ai.jpg";
import scienceImage from "@/assets/feature-gamification.jpg";
import englishImage from "@/assets/feature-multilang.jpg";

export const allLessons: LessonDetail[] = [
  {
    id: "1",
    title: "Fun with Numbers",
    description: "Learn counting, addition, and subtraction with colorful stories and everyday examples kids love!",
    image: mathImage,
    category: "Maths",
    classLevel: "Class 1-2",
    duration: "15 min",
    topics: [
      {
        title: "Counting 1 to 100",
        explanation: "Numbers are everywhere! When you count your fingers, you use numbers 1 to 10. Let's learn to count all the way to 100!\n\nThink of it like climbing stairs — each step is the next number. After 10 comes 11, 12, 13... all the way to 20. Then 21, 22... up to 100!",
        example: "Count the legs on 3 cats: 4 + 4 + 4 = 12 legs! 🐱🐱🐱",
        funFact: "The number zero was invented in India by the great mathematician Aryabhata!",
        activity: "Walk around your house and count how many windows you can find. Write the number down!"
      },
      {
        title: "Addition — Putting Together",
        explanation: "Addition means putting things together to find out how many you have in total.\n\nImagine you have 3 mangoes 🥭 and your friend gives you 2 more 🥭🥭. Now you have 3 + 2 = 5 mangoes!",
        example: "You have 4 red balls and 3 blue balls. How many balls in total?\n4 + 3 = 7 balls! 🔴🔴🔴🔴🔵🔵🔵",
        activity: "Take some pebbles or seeds. Make two groups and count them together. Try different groups!"
      },
      {
        title: "Subtraction — Taking Away",
        explanation: "Subtraction means taking away from a group. The group gets smaller!\n\nIf you have 8 chocolates 🍫 and you eat 3, how many are left? 8 - 3 = 5 chocolates!",
        example: "A tree has 10 birds. 4 fly away. How many are left?\n10 - 4 = 6 birds! 🐦",
        funFact: "Your brain does subtraction every time you share food equally with friends!",
        activity: "Draw 10 apples on paper. Cross out some and count how many remain. Try different numbers!"
      }
    ]
  },
  {
    id: "2",
    title: "Shapes Around Us",
    description: "Discover circles, triangles, squares and rectangles hiding in everyday objects around you!",
    image: mathImage,
    category: "Maths",
    classLevel: "Class 1-3",
    duration: "12 min",
    topics: [
      {
        title: "Meet the Shapes",
        explanation: "Shapes are everywhere! Look around and you'll find them:\n\n🔵 Circle — round like a ball, a coin, or the sun\n🔺 Triangle — has 3 sides, like a samosa or a mountain\n🟥 Square — has 4 equal sides, like a biscuit or a window\n📏 Rectangle — like a door, a book, or a phone",
        example: "A wheel is a circle. A slice of pizza is a triangle. A TV screen is a rectangle!",
        funFact: "Honeycombs made by bees are hexagons — a shape with 6 sides! Bees are little mathematicians! 🐝",
        activity: "Go on a Shape Hunt! Walk around your room and find 3 circles, 3 squares, and 3 rectangles. Draw them in your notebook."
      },
      {
        title: "Counting Sides and Corners",
        explanation: "Every shape has sides (the lines) and corners (where the lines meet).\n\n• Triangle: 3 sides, 3 corners\n• Square: 4 sides, 4 corners (all sides same length)\n• Rectangle: 4 sides, 4 corners (opposite sides same length)\n• Circle: 0 sides, 0 corners — it's perfectly round!",
        example: "A stop sign has 8 sides — it's called an octagon! Count the sides next time you see one.",
        activity: "Use matchsticks or straw pieces to build a triangle, square, and rectangle. Which needs the most sticks?"
      },
      {
        title: "Patterns with Shapes",
        explanation: "A pattern is something that repeats! You can make beautiful patterns using shapes.\n\n🔵🔺🔵🔺🔵🔺 — circle, triangle, circle, triangle...\n🟥🟥🔵🟥🟥🔵 — square, square, circle, square, square, circle...",
        example: "Rangoli designs use patterns with shapes! Many floor tiles also have repeating shape patterns.",
        activity: "Draw your own pattern using at least 2 different shapes. Color it and show your family!"
      }
    ]
  },
  {
    id: "3",
    title: "My Amazing Body",
    description: "Explore how your body works — from your beating heart to your growing bones!",
    image: scienceImage,
    category: "Science",
    classLevel: "Class 2-3",
    duration: "18 min",
    topics: [
      {
        title: "Our Five Senses",
        explanation: "We learn about the world using 5 amazing senses:\n\n👀 Eyes — help us SEE colors, shapes, and people\n👂 Ears — help us HEAR music, birds, and voices\n👃 Nose — helps us SMELL flowers, food, and rain\n👅 Tongue — helps us TASTE sweet, sour, salty, and bitter\n✋ Skin — helps us TOUCH and feel hot, cold, soft, and rough",
        example: "When you eat a mango, you SEE its yellow color, SMELL its sweet scent, TOUCH its smooth skin, and TASTE its yummy flavor!",
        funFact: "Your nose can remember 50,000 different smells! That's why the smell of your grandmother's cooking feels so special.",
        activity: "Close your eyes and ask someone to give you different foods. Can you guess what it is using only smell and taste?"
      },
      {
        title: "Bones and Muscles",
        explanation: "Your body has 206 bones that make up your skeleton — like a frame that holds you up! Without bones, you'd be floppy like a jellyfish! 🪼\n\nMuscles are attached to your bones. When muscles pull on bones, you MOVE! That's how you run, jump, write, and dance.",
        example: "Bend your arm — feel the muscle on top get hard? That's your bicep muscle pulling your arm bone!",
        funFact: "A baby is born with about 270 bones, but as you grow, some bones join together, leaving 206 in adults!",
        activity: "Stand up and touch your toes. Feel which parts of your body bend. Those are your joints — where two bones meet!"
      },
      {
        title: "Healthy Habits",
        explanation: "Taking care of your body is super important!\n\n🥗 Eat fruits, vegetables, dal, and roti for energy\n💧 Drink 6-8 glasses of water every day\n🏃 Exercise and play outside for 1 hour daily\n😴 Sleep 9-10 hours every night\n🧼 Wash your hands before eating and after playing",
        example: "Milk and paneer have calcium that makes your bones strong. Carrots have Vitamin A that helps your eyes!",
        activity: "Make a \"My Healthy Day\" chart. Write what healthy foods you ate, how much water you drank, and how long you played outside."
      }
    ]
  },
  {
    id: "4",
    title: "Plants — Our Green Friends",
    description: "Learn how tiny seeds become big trees, and why plants are so important for all living things.",
    image: scienceImage,
    category: "Science",
    classLevel: "Class 2-4",
    duration: "15 min",
    topics: [
      {
        title: "Parts of a Plant",
        explanation: "Every plant has important parts that help it survive:\n\n🌱 Roots — underground, they drink water from soil\n🪵 Stem — carries water from roots to leaves (like a straw!)\n🍃 Leaves — make food using sunlight (called photosynthesis)\n🌸 Flower — helps the plant make seeds\n🫘 Seeds — can grow into a new baby plant!",
        example: "A carrot IS a root! Sugarcane IS a stem! Spinach IS leaves! We eat different parts of plants!",
        funFact: "The tallest tree in the world is a redwood tree in California — it's taller than a 35-story building! 🌲",
        activity: "Find a plant near your home. Draw it and label the roots, stem, leaves, and flowers (if any)."
      },
      {
        title: "How Seeds Grow",
        explanation: "A seed is like a tiny sleeping baby plant! When it gets water, soil, and warmth, it wakes up and starts to grow. This is called germination.\n\nFirst, a tiny root pushes down into the soil. Then a tiny shoot pushes UP towards sunlight. Slowly it grows leaves and becomes a plant!",
        example: "Put a bean seed in a wet cotton ball inside a glass. In 3-4 days, you'll see it sprout! That's germination.",
        funFact: "The world's largest seed is the coco de mer — it can weigh up to 25 kg, as heavy as a small child!",
        activity: "Plant a seed in a small pot or cup with soil. Water it daily and draw what you see each day for one week."
      },
      {
        title: "Why Plants Are Important",
        explanation: "Plants are heroes of our planet! 🦸‍♂️\n\n🌬️ They give us oxygen to breathe\n🍎 They give us food — fruits, vegetables, grains\n💊 Many medicines come from plants (like neem and tulsi)\n🏠 Trees give us wood for houses and furniture\n☁️ They help bring rain and keep the earth cool",
        example: "One big tree can give enough oxygen for 4 people to breathe for a whole year!",
        activity: "Count how many products from plants you use in one day — food, paper, cotton clothes, wooden furniture. You'll be surprised!"
      }
    ]
  },
  {
    id: "5",
    title: "English Alphabet Adventure",
    description: "Master letters, simple words, and basic sentences with fun stories and rhymes!",
    image: englishImage,
    category: "English",
    classLevel: "Class 1-2",
    duration: "14 min",
    topics: [
      {
        title: "Vowels and Consonants",
        explanation: "The English alphabet has 26 letters. Five of them are very special — they are called VOWELS:\n\nA, E, I, O, U — remember: \"An Elephant Is On Umbrella!\" ☂️\n\nThe other 21 letters are called CONSONANTS. Every word needs at least one vowel to be spoken!",
        example: "CAT → C (consonant) + A (vowel) + T (consonant)\nEAT → E (vowel) + A (vowel) + T (consonant)",
        funFact: "The letter 'E' is the most used letter in English. It appears in almost every sentence you read!",
        activity: "Write your name. Circle all the vowels in red and all the consonants in blue. How many of each?"
      },
      {
        title: "Three-Letter Words",
        explanation: "The easiest English words have just 3 letters! Most follow a simple pattern: Consonant + Vowel + Consonant.\n\n🐱 C-A-T = Cat\n🐕 D-O-G = Dog\n🏃 R-U-N = Run\n☀️ S-U-N = Sun\n🚌 B-U-S = Bus",
        example: "Change just one letter to make new words!\nCAT → BAT → SAT → MAT → HAT\nThey all rhyme! 🎵",
        activity: "Pick a vowel (like 'A'). How many 3-letter words can you make with it? Write them all down! Example: BAG, BAD, BAN, BAT..."
      },
      {
        title: "Making Simple Sentences",
        explanation: "A sentence is a group of words that tells us something complete. Every sentence:\n\n✅ Starts with a CAPITAL letter\n✅ Ends with a full stop (.)\n✅ Makes complete sense\n\nPattern: Who + Does What\nThe cat sits. → Who? The cat. Does what? Sits.",
        example: "I like mangoes. ✅ (complete thought)\nThe dog runs fast. ✅ (tells us something)\nRuns fast the. ❌ (doesn't make sense!)",
        activity: "Look at 5 things around you. Write one sentence about each. Example: \"The fan is moving.\" \"My bag is blue.\""
      }
    ]
  },
  {
    id: "6",
    title: "Hindi — हिंदी मज़ा",
    description: "स्वर, व्यंजन और सरल शब्दों को मज़ेदार तरीके से सीखें! Learn Hindi vowels, consonants, and simple words.",
    image: englishImage,
    category: "Hindi",
    classLevel: "Class 1-2",
    duration: "15 min",
    topics: [
      {
        title: "स्वर (Vowels) — अ आ इ ई",
        explanation: "Hindi has 13 vowels called स्वर (swar). These are the first sounds we learn:\n\nअ (a) — अनार (Pomegranate) 🍎\nआ (aa) — आम (Mango) 🥭\nइ (i) — इमली (Tamarind)\nई (ee) — ईख (Sugarcane)\nउ (u) — उल्लू (Owl) 🦉\nऊ (oo) — ऊन (Wool)\n\nVowels are special because every Hindi word uses them!",
        example: "आम (Mango) starts with आ\nइमली (Tamarind) starts with इ\nऊंट (Camel) starts with ऊ 🐫",
        funFact: "Hindi is spoken by more than 60 crore people worldwide! It's one of the most spoken languages on Earth!",
        activity: "Write all 13 vowels (अ to अः) in your notebook. Draw one picture for each vowel. Example: अ = अनार 🍎"
      },
      {
        title: "व्यंजन (Consonants) — क ख ग",
        explanation: "Hindi has 33 consonants called व्यंजन (vyanjan). They are grouped in families:\n\nक family: क ख ग घ ङ\nच family: च छ ज झ ञ\nट family: ट ठ ड ढ ण\nत family: त थ द ध न\nप family: प फ ब भ म\n\nEach consonant combines with vowels to make syllables!",
        example: "क + अ = क (ka)\nक + आ = का (kaa)\nक + इ = कि (ki)\nक + ई = की (kee)",
        activity: "Practice writing the क family (क ख ग घ ङ) five times each. Then write one word starting with each letter."
      },
      {
        title: "Simple Words and Sentences",
        explanation: "Let's make simple Hindi sentences!\n\nयह (yah) = This\nवह (vah) = That\nमेरा (mera) = My\nहै (hai) = Is\n\nCombine them:\nयह फूल है। = This is a flower. 🌺\nवह पेड़ है। = That is a tree. 🌳\nमेरा नाम ___ है। = My name is ___.",
        example: "बिल्ली दूध पीती है। = The cat drinks milk. 🐱🥛\nसूरज गर्म है। = The sun is hot. ☀️",
        activity: "Write 5 sentences about your family in Hindi. Example: मेरी माँ अच्छी हैं। (My mother is nice.)"
      }
    ]
  },
  {
    id: "7",
    title: "Water — The Magic Liquid",
    description: "Discover why water is precious, where it comes from, and how to save every drop!",
    image: scienceImage,
    category: "Science",
    classLevel: "Class 3-4",
    duration: "16 min",
    topics: [
      {
        title: "The Water Cycle",
        explanation: "Water goes on an amazing journey that repeats forever — the Water Cycle!\n\n☀️ EVAPORATION: Sun heats water in rivers and oceans → water turns into vapor (gas) and rises up\n☁️ CONDENSATION: Vapor cools in the sky → forms tiny droplets → becomes clouds\n🌧️ PRECIPITATION: Clouds get heavy → water falls as rain or snow\n🏞️ COLLECTION: Rain flows into rivers, lakes, and underground → cycle starts again!",
        example: "Boil water in a pan and hold a cold lid above it. See the drops forming on the lid? That's condensation — just like how clouds form!",
        funFact: "The water you drink today might be the same water dinosaurs drank millions of years ago! Water is recycled endlessly! 🦕",
        activity: "Draw the water cycle with labels: Sun, Evaporation, Clouds, Rain, River, Ocean. Use arrows to show the direction."
      },
      {
        title: "States of Water",
        explanation: "Water is magical because it can exist in 3 forms:\n\n💧 LIQUID — water you drink, rivers, rain\n❄️ SOLID — ice cubes, snow, glaciers\n💨 GAS — steam from hot chai, water vapor in air\n\nWhat changes water's form? TEMPERATURE!\nHeat ice → it melts into water\nHeat water → it becomes steam\nCool steam → it becomes water again!",
        example: "Put water in the freezer → it becomes ice (solid). Leave ice outside → it melts back to water (liquid)!",
        activity: "Experiment: Put an ice cube on a plate in the sun. Time how long it takes to melt completely. Draw what you observe every 5 minutes."
      },
      {
        title: "Save Water, Save Life",
        explanation: "Only 1% of Earth's water is fresh and usable! That's very little. We must save it!\n\n🚿 Turn off the tap while brushing teeth — saves 10 litres!\n🪣 Use a bucket instead of a hose to wash — saves 100 litres!\n🌧️ Collect rainwater for plants\n🔧 Fix leaking taps immediately\n🌿 Water plants in the evening when it's cooler (less evaporation)",
        example: "If a tap drips once every second, it wastes 20 litres a day — that's enough for someone to drink for 10 days!",
        funFact: "It takes about 1,000 litres of water to grow the wheat for just one roti! Water is hidden in everything we use.",
        activity: "Be a Water Detective for one day! Note every time your family uses water. Find 3 ways you can save water at home."
      }
    ]
  },
  {
    id: "8",
    title: "My India — Our Country",
    description: "Travel across India and learn about states, festivals, food, and our national symbols!",
    image: englishImage,
    category: "Social Science",
    classLevel: "Class 3-5",
    duration: "20 min",
    topics: [
      {
        title: "National Symbols of India",
        explanation: "India has beautiful national symbols that represent our country:\n\n🇮🇳 National Flag — Tiranga (Saffron, White, Green with Ashoka Chakra)\n🦁 National Emblem — Ashoka Pillar with 4 lions\n🐅 National Animal — Bengal Tiger\n🦚 National Bird — Peacock\n🪷 National Flower — Lotus\n🏑 National Game — Hockey\n🎵 National Anthem — Jana Gana Mana (by Rabindranath Tagore)\n🎶 National Song — Vande Mataram (by Bankim Chandra Chattopadhyay)",
        example: "The 24 spokes on the Ashoka Chakra represent 24 hours — reminding us that time never stops and we should always keep moving forward!",
        funFact: "India's national flag was designed by Pingali Venkayya. The saffron means courage, white means peace, and green means prosperity!",
        activity: "Draw the Indian flag with correct colors and the Ashoka Chakra. Write the meaning of each color below it."
      },
      {
        title: "Festivals of India",
        explanation: "India is called the \"Land of Festivals\" because we celebrate so many!\n\n🪔 Diwali — Festival of lights (October/November)\n🎨 Holi — Festival of colors (March)\n🌙 Eid — Festival of sharing and prayer\n✝️ Christmas — Birthday of Jesus Christ (December 25)\n🙏 Guru Nanak Jayanti — Birthday of Guru Nanak\n🎋 Pongal/Makar Sankranti — Harvest festival (January)\n🐘 Onam — Grand harvest festival of Kerala",
        example: "During Diwali, families clean their homes, make rangoli, light diyas, and share sweets. It celebrates the return of Lord Ram to Ayodhya!",
        funFact: "India celebrates at least one festival almost every week of the year! That's why we say 'Unity in Diversity.'",
        activity: "Write about your favorite festival. Draw how you celebrate it. Include: What do you eat? What do you wear? Who comes to your house?"
      },
      {
        title: "States and Foods of India",
        explanation: "India has 28 states and 8 union territories. Each has special food!\n\n🍛 Punjab → Makki ki Roti & Sarson ka Saag\n🍚 West Bengal → Rasgulla & Macher Jhol (fish curry)\n🥥 Kerala → Appam & Stew, Banana Chips\n🌶️ Rajasthan → Dal Baati Churma\n🍲 Tamil Nadu → Dosa, Idli, Sambar\n🧈 Gujarat → Dhokla, Thepla\n🍜 Assam → Masor Tenga (sour fish curry)",
        example: "If you travel from Kashmir to Kanyakumari (3,800 km!), you'll pass through many states and taste completely different foods in each!",
        activity: "Ask your family about the special food of your state. Draw a plate of that food and write what ingredients it needs."
      }
    ]
  },
  {
    id: "9",
    title: "Multiplication Magic",
    description: "Master multiplication tables from 2 to 10 with clever tricks, patterns, and fun shortcuts!",
    image: mathImage,
    category: "Maths",
    classLevel: "Class 2-4",
    duration: "18 min",
    topics: [
      {
        title: "What is Multiplication?",
        explanation: "Multiplication is just FAST ADDITION! Instead of adding the same number many times, we multiply.\n\n3 + 3 + 3 + 3 = 12 → This is the same as 3 × 4 = 12!\n\nThink of it as groups:\n🍎🍎🍎 🍎🍎🍎 🍎🍎🍎 🍎🍎🍎 = 4 groups of 3 = 12 apples!",
        example: "If 5 friends each have 2 pencils, total pencils = 5 × 2 = 10 ✏️✏️✏️✏️✏️✏️✏️✏️✏️✏️",
        funFact: "The symbol × for multiplication was first used in 1631 by an English mathematician named William Oughtred!",
        activity: "Arrange 20 seeds or buttons in groups of 2, then 4, then 5. Write the multiplication for each arrangement."
      },
      {
        title: "Cool Tricks for Tables",
        explanation: "Here are tricks to remember tables easily:\n\n✨ Table of 2 → Just double the number! 2×6 = 12 (6+6)\n✨ Table of 5 → Always ends in 0 or 5! (5,10,15,20,25...)\n✨ Table of 9 → Digits always add up to 9! (9,18,27,36,45...→ 1+8=9, 2+7=9)\n✨ Table of 10 → Just add a zero! 10×7 = 70\n✨ Table of 11 → Up to 9, repeat the digit! 11×4 = 44",
        example: "9 × 7 = ? Use the finger trick! Hold up 10 fingers. Fold down finger #7. Count: 6 fingers before, 3 after → 63! ✋",
        activity: "Write the 9 times table and check: do the digits always add up to 9? Try: 9×5=45 → 4+5=?"
      },
      {
        title: "Multiplication in Real Life",
        explanation: "We use multiplication every day without realizing it!\n\n🛒 Shopping: 3 notebooks × ₹10 each = ₹30 total\n🏫 Classroom: 5 rows × 6 chairs = 30 chairs\n🚗 Travel: If a car moves 60 km every hour, in 3 hours it covers 60 × 3 = 180 km!\n🍪 Cooking: If one recipe needs 2 cups of flour, for 4 batches you need 2 × 4 = 8 cups",
        example: "Your school has 4 floors and 6 classrooms on each floor. Total classrooms = 4 × 6 = 24!",
        activity: "Visit a shop with your parent. Find the cost of 1 item and calculate: how much would 3, 5, and 7 of that item cost?"
      }
    ]
  },
  {
    id: "10",
    title: "Animals and Their Homes",
    description: "Explore where different animals live, what they eat, and how they protect themselves!",
    image: scienceImage,
    category: "Science",
    classLevel: "Class 1-3",
    duration: "14 min",
    topics: [
      {
        title: "Where Animals Live",
        explanation: "Just like we live in houses, animals have special homes too!\n\n🐦 Bird → Nest (made of twigs, grass, feathers)\n🐝 Bee → Beehive (made of wax)\n🐇 Rabbit → Burrow (hole under the ground)\n🕷️ Spider → Web (made of silk thread)\n🐻 Bear → Den or cave\n🐟 Fish → Water (rivers, ponds, oceans)\n🐜 Ant → Anthill (tiny tunnels underground)",
        example: "A weaver bird builds one of the most amazing nests! It weaves grass into a hanging nest that looks like a little bag on a tree branch! 🪺",
        funFact: "The Arctic fox's den can be hundreds of years old! Fox families pass it down through generations — a true family home!",
        activity: "Look outside your window or go for a walk. Can you spot any animal homes? Draw 3 animal homes you find."
      },
      {
        title: "What Animals Eat",
        explanation: "Animals eat different kinds of food:\n\n🌿 HERBIVORES — eat only plants\nExamples: Cow, Horse, Elephant, Deer, Rabbit\n\n🥩 CARNIVORES — eat only other animals\nExamples: Lion, Tiger, Eagle, Shark\n\n🍽️ OMNIVORES — eat both plants AND animals\nExamples: Bear, Crow, Dog, Humans!",
        example: "Look at an animal's teeth! Herbivores have flat teeth for grinding plants. Carnivores have sharp teeth for tearing meat. We have BOTH types — because we're omnivores!",
        funFact: "An elephant eats about 150 kg of food every day! That's like eating 1,500 rotis! 🐘",
        activity: "Make 3 columns: Herbivore, Carnivore, Omnivore. Write 5 animals in each column. Which column was hardest?"
      },
      {
        title: "How Animals Protect Themselves",
        explanation: "Animals have clever ways to stay safe from danger:\n\n🦎 Camouflage — Chameleon changes color to hide\n🦔 Spines — Porcupine's sharp quills keep enemies away\n🐢 Shell — Turtle hides inside its hard shell\n🦨 Smell — Skunk sprays a terrible smell\n🏃 Speed — Deer runs very fast to escape\n🐙 Ink — Octopus squirts ink to confuse enemies",
        example: "A stick insect looks EXACTLY like a twig! A predator could walk right past it without noticing. That's camouflage!",
        activity: "Pick your favorite animal. Draw it and write: Where does it live? What does it eat? How does it protect itself?"
      }
    ]
  },
  {
    id: "11",
    title: "Maps and Directions",
    description: "Learn to read maps, understand directions, and explore the geography around you!",
    image: englishImage,
    category: "Social Science",
    classLevel: "Class 3-5",
    duration: "16 min",
    topics: [
      {
        title: "The Four Directions",
        explanation: "There are 4 main directions that help us find our way:\n\n⬆️ NORTH — towards the North Pole (top of maps)\n⬇️ SOUTH — towards the South Pole (bottom of maps)\n➡️ EAST — where the Sun rises 🌅\n⬅️ WEST — where the Sun sets 🌇\n\nEasy trick to remember: \"Never Eat Soggy Waffles\" (North, East, South, West going clockwise!)",
        example: "In India, if you travel North from Chennai, you'll reach Delhi. If you go South from Delhi, you'll reach Chennai!",
        funFact: "The compass was invented in China around 2,000 years ago! Ancient sailors used it to find their way across oceans.",
        activity: "Stand outside in the morning. Face the Sun (East). Your back is West, left hand is North, right hand is South. Find North, South, East, West from your home!"
      },
      {
        title: "Reading a Map",
        explanation: "A map is a picture of a place as seen from above (bird's eye view!) 🗺️\n\nEvery map has:\n📍 Title — tells what the map shows\n🧭 Compass Rose — shows directions\n📏 Scale — tells real distance (1 cm = 1 km)\n🎨 Legend/Key — explains the symbols used\n\nBlue = water, Green = forests, Brown = mountains, Yellow = desert",
        example: "If a map's scale says 1 cm = 10 km, and two cities are 3 cm apart on the map, the real distance is 30 km!",
        activity: "Draw a simple map of your classroom or bedroom. Show the door, windows, tables, and chairs. Add a compass rose!"
      },
      {
        title: "Landforms Around Us",
        explanation: "Earth's surface has different shapes called landforms:\n\n🏔️ Mountain — very high land with peaks (Himalayas!)\n🏜️ Desert — hot, dry, sandy land (Thar Desert)\n🌊 Ocean — huge water body with salty water\n🏞️ Valley — low land between mountains\n🏝️ Island — land surrounded by water on all sides\n🌾 Plain — flat, level land good for farming (Indo-Gangetic Plain)",
        example: "India has ALL these landforms! Himalayas in the North, Thar Desert in the West, Plains in the middle, and Oceans in the South!",
        activity: "Use clay or dough to make a model showing a mountain, valley, river, and plain. Label each landform."
      }
    ]
  },
  {
    id: "12",
    title: "Story Writing & Creativity",
    description: "Learn to write fun stories with interesting characters, exciting plots, and happy endings!",
    image: englishImage,
    category: "English",
    classLevel: "Class 3-5",
    duration: "17 min",
    topics: [
      {
        title: "Parts of a Story",
        explanation: "Every good story has these parts:\n\n📖 BEGINNING — Introduce the characters and where the story happens\n\"Once upon a time, in a small village near a forest, there lived a clever girl named Meera.\"\n\n⚡ MIDDLE — Something exciting happens! A problem or adventure\n\"One day, Meera found a magical seed that could talk!\"\n\n🎉 ENDING — The problem is solved, the story wraps up\n\"Meera planted the seed, and it grew into a tree that told stories to all the village children.\"",
        example: "Think of your favorite movie. Can you find the Beginning, Middle, and Ending? Every story follows this pattern!",
        activity: "Write a 5-sentence story about a talking animal. Make sure it has a clear beginning, middle, and ending!"
      },
      {
        title: "Creating Interesting Characters",
        explanation: "Characters make stories come alive! To create a good character, think about:\n\n👤 Name — Give them a fun name\n🎭 Personality — Are they brave? Funny? Shy? Curious?\n👀 Appearance — What do they look like?\n❤️ What they want — Every character wants something!\n🌟 What makes them special — A superpower, skill, or quality\n\nExample character: \"Bunty is a small brown squirrel who loves to collect shiny things. He is very curious and always gets into funny adventures!\"",
        example: "In the story of \"The Thirsty Crow,\" the crow is CLEVER — that's what makes the story interesting. Without cleverness, there's no story!",
        activity: "Create your own character! Draw them and write: their name, age, 3 things they like, 1 thing they're afraid of, and their special skill."
      },
      {
        title: "Using Describing Words",
        explanation: "Describing words (adjectives) make your writing colorful and exciting!\n\n❌ Boring: \"The dog sat near the tree.\"\n✅ Exciting: \"The fluffy, golden dog sat near the huge, old tree.\"\n\nUse your senses to describe:\n👀 See: bright, tiny, sparkling, dark\n👂 Hear: loud, quiet, musical, roaring\n👃 Smell: sweet, fresh, stinky\n✋ Feel: soft, rough, warm, cold\n👅 Taste: yummy, sour, spicy, bitter",
        example: "\"The small girl ate rice\" → \"The cheerful little girl happily ate hot, delicious rice with spicy dal.\" — See the difference? 🌟",
        activity: "Pick any object near you (a pen, a bag, a flower). Write 5 describing words for it. Then write a sentence using at least 3 of those words."
      }
    ]
  }
];
