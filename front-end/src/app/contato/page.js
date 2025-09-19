'use client'
 
import Contato from "@/components/Contato/Contato";
import HomeNavbar from "@/components/home/HomeNavbar";
import HomeFooter from "@/components/home/HomeFooter";
import { useSEO } from "@/hooks/useSEO";
import { getSEOConfig } from "@/config/seo";
 
 
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
 
