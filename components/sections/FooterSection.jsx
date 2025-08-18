"use client";
import React from "react";
import Image from "next/image";
import AlphaFitness from "@/components/Alphafitness";
import Link from "next/link";
import { menus, contactInfo } from "@/constant/menu";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { motion } from "framer-motion";

export default function FooterSection() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: i * 0.2, // stagger for each column
      },
    }),
  };

  return (
    <footer
      id="contact"
      className="w-full h-auto flex flex-col bg-[linear-gradient(157deg,#0A0F1C_0%,#000000_50%,#111B2E_100%)] relative overflow-hidden"
    >
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-60"></div>

      {/* Main footer */}
      <div className="screen flex w-full h-full py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
          >
            {/* Company Info */}
            <motion.div
              variants={fadeUp}
              custom={0}
              className="md:col-span-2 lg:col-span-1 space-y-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <Image
                    src={"/ALPHAFIT.LOGO.png"}
                    alt="Alpha Fitness Logo"
                    width={50}
                    height={50}
                    className="drop-shadow-lg"
                  />
                  <div className="absolute inset-0 bg-secondary/20 rounded-full blur-md -z-10"></div>
                </div>
                <AlphaFitness />
              </div>

              <p className="font-arone text-white opacity-70 text-sm sm:text-base leading-relaxed max-w-xs">
                Your premier destination for fitness excellence and personal
                transformation with cutting-edge facilities.
              </p>

              {/* Socials */}
              <div className="flex space-x-3 pt-4">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center hover:bg-secondary/40 transition-all duration-300 cursor-pointer group"
                  >
                    <Icon className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={fadeUp} custom={1} className="space-y-6">
              <h3 className="text-white font-arone text-lg font-bold mb-1">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {menus.map((menu, index) => (
                  <li key={index}>
                    <Link
                      href={menu.path}
                      className="font-arone text-white opacity-70 hover:opacity-100 hover:text-secondary transition-all duration-300 text-sm sm:text-base block py-1 relative group"
                    >
                      <span className="relative z-10">{menu.title}</span>
                      <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300"></div>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={fadeUp} custom={2} className="space-y-6">
              <h3 className="text-white font-arone text-lg font-bold mb-1">
                Contact Info
              </h3>
              <ul className="space-y-4">
                {contactInfo.map((info, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 text-white opacity-70 group hover:opacity-100 transition-opacity duration-300"
                  >
                    <info.icon className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform duration-300 mt-0.5" />
                    <span className="font-arone text-sm sm:text-base leading-relaxed">
                      <a
                        href={info.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {info.title}
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Open Hours */}
            <motion.div variants={fadeUp} custom={3} className="space-y-6">
              <h3 className="text-white font-arone text-lg font-bold mb-1">
                Open Hours
              </h3>
              <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/20">
                <h4 className="text-white font-arone font-semibold text-sm sm:text-base mb-2 text-center">
                  🔓 24/7 Access for Members
                </h4>
              </div>

              <div className="space-y-3">
                <h5 className="text-white font-arone font-semibold text-sm opacity-90">
                  Staff Hours:
                </h5>
                <ul className="text-white opacity-70 space-y-2 font-arone text-sm">
                  <li className="flex justify-between items-center py-1 border-b border-white/10">
                    <span>Mon - Sat:</span>
                    <span className="text-secondary font-semibold">
                      7AM - 10PM
                    </span>
                  </li>
                  <li className="flex justify-between items-center py-1">
                    <span>Sunday:</span>
                    <span className="text-secondary font-semibold">
                      7AM - 10PM
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="screen w-full px-4 sm:px-6 lg:px-8 pb-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="px-4 bg-[linear-gradient(157deg,#0A0F1C_0%,#000000_50%,#111B2E_100%)]">
                <div className="w-12 h-0.5 bg-secondary rounded-full opacity-60"></div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center"
          >
            <p className="font-arone text-white opacity-70 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
              © 2024 Alpha Fitness. All rights reserved. | Designed with passion
              for fitness excellence.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-4 sm:hidden">
              <Link
                href="/privacy"
                className="text-white opacity-50 hover:opacity-70 text-xs font-arone transition-opacity"
              >
                Privacy Policy
              </Link>
              <span className="text-white opacity-30">•</span>
              <Link
                href="/terms"
                className="text-white opacity-50 hover:opacity-70 text-xs font-arone transition-opacity"
              >
                Terms of Service
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative bottom line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/60 to-transparent"></div>
    </footer>
  );
}
