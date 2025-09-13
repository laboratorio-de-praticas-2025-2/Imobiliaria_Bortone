'use client'
 
import Header from "@/components/home/Header";
import Contato from "@/components/contato/Contato";
import HomeNavbar from "@/components/home/HomeNavbar";
import HomeFooter from "@/components/home/HomeFooter";
import SplashScreen from "@/components/SplashScreen";
import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { getSEOConfig } from "@/config/seo";
import { Divider } from "antd";
 
 
export default function ContatoPage(){
 
    useSEO(getSEOConfig('/contato'));
 
    return(

        <>
            <HomeNavbar/>
            <Contato/>
            <HomeFooter/>
        </>
       
    )

}
 