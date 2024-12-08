"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NavLink(props){
    const pathname = usePathname()
    const isActive = pathname === props.path
    return(
        <Link className={isActive ? "opacity-100" : "opacity-50 hover:opacity-65"} href={props.path}>
            {props.text}
        </Link>
    )
}