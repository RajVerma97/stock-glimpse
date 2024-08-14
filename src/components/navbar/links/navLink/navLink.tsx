"use client";

import Link from "next/link";

import React from "react";
import styles from "./navLink.module.css";
import { usePathname } from "next/navigation";
import { Console } from "console";

interface NavLinkProps{
    item:{
        title:string;
        path:string;
    };
}

const  NavLink:React.FC<NavLinkProps>=({ item }) =>{
  const pathName = usePathname();
  

  return (
    <Link
      href={item.path}
      key={item.title}
      className={`${styles.container} ${
        pathName === item.path && styles.active
      }`}
    >
      {item.title}
    </Link>
  );
}
export default NavLink;
