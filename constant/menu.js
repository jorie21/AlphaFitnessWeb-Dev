import { MapPin } from 'lucide-react'
import { Phone } from 'lucide-react';
import { Mail } from 'lucide-react';
export const menus = [
  { title: "Home", path: "/"},
  { title: "Services", path: "/services" },
  { title: "About", path: "#about" },
  { title: "Contact Us", path: "#contact" },
];

export const contactInfo = [
  {
    icon: MapPin ,
    title: "JD Building, E Rodriguez Hwy, Brgy, San Jose, 1860 Rizal",
    link: 'https://www.google.com/maps?q=JD+Building,+E+Rodriguez+Highway,+Brgy.+San+Jose,+Montalban,+Rizal'
  },
  {
    icon: Phone,
    title: "0917 888 0359",
    link: "tel:09178880359"
  },
  {
    icon: Mail,
    title: "Alphafitnesscenter8@gmail.com",
    link: "mailto:Alphafitnesscenter8@gmail.com"
  }
 
]