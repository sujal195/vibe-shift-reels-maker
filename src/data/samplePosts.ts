
export interface SamplePost {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
  mediaType?: "photo" | "voice";
  mediaUrl?: string;
  privacy?: "public" | "friends" | "private";
}

const getRandomDate = (startDays = 1, endDays = 14) => {
  const start = new Date();
  start.setDate(start.getDate() - startDays);
  
  const end = new Date();
  end.setDate(end.getDate() - endDays);
  
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Define sample authors
const sampleAuthors = [
  {
    id: "author-1",
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "author-2",
    name: "Mike Chen",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "author-3",
    name: "Zoe Williams",
    avatar: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "author-4",
    name: "Marcus Lopez",
    avatar: "https://i.pravatar.cc/150?img=4"
  },
  {
    id: "author-5",
    name: "Aisha Patel",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: "author-6",
    name: "Jordan Taylor",
    avatar: "https://i.pravatar.cc/150?img=6"
  }
];

// Emotional memory posts
const emotionalPosts: SamplePost[] = [
  {
    id: "emotional-1",
    content: "the last hug i had with my mom before leaving for college... didn't know it would be this hard to say goodbye 💔",
    author: sampleAuthors[0],
    createdAt: getRandomDate(1, 5),
    likes: getRandomNumber(45, 120),
    comments: getRandomNumber(5, 30),
    privacy: "public"
  },
  {
    id: "emotional-2",
    content: "Found this voice note from my grandpa who passed away last year. I listen to it whenever I miss his voice. Some memories are too precious to lose.",
    author: sampleAuthors[2],
    createdAt: getRandomDate(2, 7),
    likes: getRandomNumber(80, 200),
    comments: getRandomNumber(15, 40),
    mediaType: "voice",
    mediaUrl: "https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-1.mp3",
    privacy: "friends"
  },
  {
    id: "emotional-3",
    content: "one year ago today we lost dad. still can't believe i won't hear him laugh again. miss you everyday.",
    author: sampleAuthors[4],
    createdAt: getRandomDate(1, 3),
    likes: getRandomNumber(120, 250),
    comments: getRandomNumber(30, 60),
    privacy: "public"
  },
  {
    id: "emotional-4",
    content: "this voice note saved me on my worst day last year when i thought nobody cared. sometimes a friend's voice is all you need to keep going.",
    author: sampleAuthors[1],
    createdAt: getRandomDate(3, 10),
    likes: getRandomNumber(50, 100),
    comments: getRandomNumber(10, 25),
    mediaType: "voice",
    mediaUrl: "https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-2.mp3",
    privacy: "public"
  },
  {
    id: "emotional-5",
    content: "Took this pic of the last sunset we watched together before he deployed. Six more months to go. Missing you is the hardest part of each day ❤️",
    author: sampleAuthors[3],
    createdAt: getRandomDate(1, 4),
    likes: getRandomNumber(70, 130),
    comments: getRandomNumber(12, 35),
    mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?q=80&w=1000",
    privacy: "public"
  }
];

// Funny/relatable posts
const funnyPosts: SamplePost[] = [
  {
    id: "funny-1",
    content: "that one time i laughed so hard i snorted coffee through my nose in the middle of a team meeting... and someone recorded it 💀 #neverlivingitdown",
    author: sampleAuthors[1],
    createdAt: getRandomDate(1, 6),
    likes: getRandomNumber(200, 500),
    comments: getRandomNumber(40, 90),
    mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1513267048331-5611cad62e41?q=80&w=1000",
    privacy: "public"
  },
  {
    id: "funny-2",
    content: "tried confessing my crush... accidentally sent it to the class group chat instead of him 🙃 can i just be swallowed by the earth now pls",
    author: sampleAuthors[0],
    createdAt: getRandomDate(2, 8),
    likes: getRandomNumber(300, 600),
    comments: getRandomNumber(50, 120),
    privacy: "public"
  },
  {
    id: "funny-3",
    content: "my 3am cooking disaster caught on camera by my roommate. apparently making ramen 'my way' is now banned in our apartment lol",
    author: sampleAuthors[5],
    createdAt: getRandomDate(1, 5),
    likes: getRandomNumber(150, 250),
    comments: getRandomNumber(30, 70),
    mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1517093157656-b9eccef01cb1?q=80&w=1000",
    privacy: "public"
  }
];

// Deep/dark posts
const deepPosts: SamplePost[] = [
  {
    id: "deep-1",
    content: "i haven't cried in 3 years, and today i finally did. it feels like breathing again after holding my breath for so long.",
    author: sampleAuthors[4],
    createdAt: getRandomDate(1, 4),
    likes: getRandomNumber(80, 150),
    comments: getRandomNumber(20, 45),
    privacy: "public"
  },
  {
    id: "deep-2",
    content: "This was the last thing I said to my dad before he passed. I didn't know our goodbye at the hospital would be final. If you still have your parents, please call them today. Just to say hi.",
    author: sampleAuthors[2],
    createdAt: getRandomDate(2, 7),
    likes: getRandomNumber(220, 400),
    comments: getRandomNumber(60, 120),
    privacy: "public"
  }
];

// Visual aesthetic posts
const visualPosts: SamplePost[] = [
  {
    id: "visual-1",
    content: "it smelled like rain and freedom that day.",
    author: sampleAuthors[3],
    createdAt: getRandomDate(1, 5),
    likes: getRandomNumber(180, 350),
    comments: getRandomNumber(15, 40),
    mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1000",
    privacy: "public"
  },
  {
    id: "visual-2",
    content: "sometimes the city feels like it's breathing with me.",
    author: sampleAuthors[5],
    createdAt: getRandomDate(2, 8),
    likes: getRandomNumber(150, 300),
    comments: getRandomNumber(10, 35),
    mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1534077880694-60179323f611?q=80&w=1000",
    privacy: "public"
  },
  {
    id: "visual-3",
    content: "4am drives with no destination. just thoughts and empty roads.",
    author: sampleAuthors[0],
    createdAt: getRandomDate(1, 6),
    likes: getRandomNumber(200, 400),
    comments: getRandomNumber(20, 50),
    mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1000",
    privacy: "public"
  }
];

// Combine all posts
export const samplePosts: SamplePost[] = [
  ...emotionalPosts,
  ...funnyPosts,
  ...deepPosts,
  ...visualPosts
];
