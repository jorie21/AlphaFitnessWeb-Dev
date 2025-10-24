// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { announcements } from "@/constant/announcements";

// const gradients = [
//   "bg-gradient-to-br from-red-500 via-pink-600 to-red-700",
//   "bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700",
//   "bg-gradient-to-br from-green-500 via-emerald-600 to-green-700",
//   "bg-gradient-to-br from-violet-500 via-purple-600 to-violet-700",
// ];

// export default function AnnouncementCarousel() {
//   const [current, setCurrent] = useState(0);
//   const total = announcements.length;

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % total);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [total]);

//   return (
//     <div className="relative w-full max-w-4xl mx-auto py-6">
//       {/* Slider container */}
//       <div className="overflow-hidden">
//         <div
//           className="flex transition-transform duration-700 ease-in-out"
//           style={{ transform: `translateX(-${current * 100}%)` }}
//         >
//           {announcements.map((data, index) => {
//             const bg = data?.background || gradients[index % gradients.length];

//             return (
//               <Card
//                 key={data.id}
//                 className={`relative rounded-3xl p-6 text-white shadow-2xl ${bg} flex flex-col justify-between min-h-[400px] w-full flex-shrink-0
//                   md:min-h-[400px]
//                   mobile:min-h-screen mobile:rounded-none mobile:p-8`}
//               >
//                 {/* Frosted glass overlay for mobile */}
//                 <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-3xl md:hidden"></div>

//                 {/* Logo */}
//                 <div className="flex justify-center mb-6 relative z-10">
//                   {data?.logos?.main && (
//                     <Image
//                       src={data.logos.main.replace("/public", "")}
//                       alt="Alpha Fitness Logo"
//                       width={90}
//                       height={90}
//                       className="object-contain rounded-full border-4 border-white shadow-lg
//                         mobile:w-20 mobile:h-20"
//                     />
//                   )}
//                 </div>

//                 {/* Titles */}
//                 <CardHeader className="text-center relative z-10">
//                   <CardTitle className="text-3xl md:text-4xl mobile:text-5xl font-extrabold tracking-tight">
//                     {data?.title || "No Title"}
//                   </CardTitle>
//                   {data?.subtitle && (
//                     <p className="text-lg italic opacity-90 mobile:text-xl">
//                       {data.subtitle}
//                     </p>
//                   )}
//                 </CardHeader>

//                 <CardContent className="space-y-4 relative z-10">
//                   {/* Offers */}
//                   {data?.offers?.length > 0 ? (
//                     <div className="space-y-2">
//                       {data.offers.map((offer, idx) => (
//                         <div
//                           key={idx}
//                           className="flex justify-between items-center text-lg font-medium mobile:text-xl"
//                         >
//                           <span>{offer.name}</span>
//                           <span className="font-bold text-yellow-300">
//                             {offer.price}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <>
//                       <h2 className="text-3xl font-bold mobile:text-4xl">
//                         {data?.price}
//                       </h2>
//                       <p className="text-lg mobile:text-xl">{data?.offer}</p>
//                       <p className="text-md italic mobile:text-lg">
//                         {data?.duration}
//                       </p>
//                       <p className="text-sm opacity-80 mobile:text-base">
//                         {data?.promo_period}
//                       </p>
//                     </>
//                   )}

//                   {/* Classes */}
//                   {data?.classes_included?.length > 0 && (
//                     <p className="text-sm mobile:text-base">
//                       <span className="font-bold">Classes:</span>{" "}
//                       {data.classes_included.join(", ")}
//                     </p>
//                   )}

//                   {/* Perks */}
//                   {data?.perks?.length > 0 && (
//                     <div className="mt-2 space-y-1">
//                       {data.perks.map((perk, idx) => (
//                         <div
//                           key={idx}
//                           className="flex items-center gap-2 text-sm mobile:text-base"
//                         >
//                           {perk?.logo && (
//                             <Image
//                               src={perk.logo.replace("/public", "")}
//                               alt={perk.name}
//                               width={18}
//                               height={18}
//                               className="object-contain"
//                             />
//                           )}
//                           <span>
//                             {perk.name} – {perk.description}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {/* CTA Button */}
//                   {data?.cta && (
//                     <div className="flex justify-center mt-4">
//                       <Button
//                         variant="secondary"
//                         className="text-white w-full py-4 text-lg rounded-full shadow-lg mobile:text-xl"
//                         onClick={() => (window.location.href = data.cta.url)}
//                       >
//                         {data.cta.text}
//                       </Button>
//                     </div>
//                   )}

//                   {/* Small Print */}
//                   {data?.small_print && (
//                     <p className="text-xs opacity-80 text-center mt-4 mobile:text-sm">
//                       {data.small_print}
//                     </p>
//                   )}
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center mt-4 space-x-2 mobile:mt-6">
//         {announcements.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrent(index)}
//             className={`w-3 h-3 rounded-full ${
//               current === index ? "bg-white" : "bg-gray-400"
//             } transition mobile:w-4 mobile:h-4`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
