import { ShoppingCart, Calendar1, CirclePoundSterling } from "lucide-react";
import { Medal } from "lucide-react";

export const totalValue = [
  {
    total: 0,
    title: "Services Purchase",
    icon: ShoppingCart,
    color: "text-secondary",
  },
  {
    total: 12,
    title: "Months Member",
    icon: Calendar1,
    color: "text-Blue",
  },
  {
    total: 516,
    title: "Loyalty Points",
    icon: CirclePoundSterling,
    color: "text-Green",
  },
];

export const loyaltyStatus = [
  {
    icon: Medal,
    title: "Bronze",
    description: "3+ Purchases",
    color: '#CD7F32'
  },
  {
    icon:  Medal,
    title: "Silver",
    description: "6+ Purchases",
    color: '#929090'
  },
  {
    icon: Medal ,
    title: "Gold",
    description: "10+ Purchases",
    color: '#FFA807'
  },
];
