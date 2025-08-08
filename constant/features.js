 import { Dumbbell, UsersRound, CheckCircle, Heart, Sauna, Users, BoxingGlove } from "lucide-react";
 export const features = [
    {
      icon: <Dumbbell className="text-red-500 w-6 h-6 opacity-80"/>,
      title: "Expert Trainers",
      desc: "Certified professionals with years of experience in fitness and nutrition.",
    },
    {
      icon: <UsersRound className="text-blue-500 w-6 h-6 opacity-80"/>,
      title: "Personalized Programs",
      desc: "Customized workout and nutrition plans tailored to your specific goals.",
    },
    {
      icon: <Heart className="text-green-500 w-6 h-6 opacity-80"/>,
      title: "Community Support",
      desc: "Join a motivating community that celebrates every milestone with you.",
    },
    {
      icon: <CheckCircle className="text-purple-500 w-6 h-6 opacity-80"/>,
      title: "Results Guaranteed",
      desc: "Our proven methods and dedicated support ensure you achieve your goals.",
    },
  ];
  export const stats = [
    { value: "2019", label: "Established", color: "text-secondary" },
    { value: "15+", label: "Expert Trainers", color: "text-Blue" },
    { value: "15,000+", label: "Success Stories", color: "text-Green" },
  ];

  export const featureSelection = [
    {
        title: "Sauna & Recovery",
        description: "Relax your muscles and mind with our modern sauna for post-training wellness",
        borderColor: "border-secondary/50 border-2",
        bgColor: "bg-secondary/30",
        icon: "/icons/sauna.png",
    },
    {
        title: "5000+ Members",
        description: "Join our thriving community of fitness enthusiasts and achievers",
        borderColor: "border-Blue/50 border-2",
        bgColor: "bg-Blue/30",
        icon: "/icons/members.png",
    },
    {
        title: "Premium Equipments",
        description: "State-of-the-art machines and free weights from top manufacturers",
        borderColor: "border-Green/50 border-2",
        bgColor: "bg-Green/30",
        icon: "/icons/PremiumEquipments.png",
    },
    {
        title: "Martial Arts & Group Classes",
        description: "Yoga, Muay Thai, Boxing & MMA classes for all levels",
        borderColor: "border-Purple/50 border-2",
        bgColor: "bg-Purple/30",
        icon: "/icons/Boxing.png",
    },
  ];


  export const keycardFeature= [
    "Physical keycard issuance",
    "Facility access activation", 
    "Account setup"
  ];
  export const keycardRenew= [
    "Extend keycard validity",
    "Maintain existing services", 
    "Instant activation"
  ];

  export const testimonials = [
 {
    id: 1,
    rating: 5,
    testimonial: "Alpha Fitness transformed my life! The trainers are incredibly supportive, and the community is amazing. I've never felt better.",
    image: "/icons/coach.png",
    name: "Jane Doe",
    role: "Fitness Enthusiast",
 },
 {
    id: 2,
    rating: 4,
    testimonial: "The facilities are top-notch, and the variety of classes keeps me motivated. Highly recommend for anyone serious about their fitness journey.",
    image: "/icons/coach.png",
    name: "John Smith",
    role: "Gym Member",
 },
 {
    id: 3,
    rating: 5,
    testimonial: "I've seen incredible results since joining Alpha Fitness. The personalized training plans made all the difference.",
    image: "/icons/coach.png",
    name: "Emily White",
    role: "Athlete",
 },
 {
    id: 4,
    rating: 5,
    testimonial: "The atmosphere is so positive and encouraging. It's more than just a gym; it's a family.",
    image: "/icons/coach.png",
    name: "Michael Brown",
    role: "New Member",
 },
 {
    id: 5,
    rating: 4,
    testimonial: "Great equipment and clean environment. The staff is always friendly and helpful.",
    image: "/icons/coach.png",
    name: "Sarah Green",
    role: "Regular Attendee",
 },
 {
    id: 6,
    rating: 5,
    testimonial: "Joining Alpha Fitness was the best decision for my health. The classes are challenging and fun!",
    image: "/icons/coach.png",
    name: "David Lee",
    role: "Yoga Practitioner",
 },
];
