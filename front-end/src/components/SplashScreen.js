
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function SplashScreen({ animateOut }) {
    const splashRef = useRef(null);

    useEffect(() => {
        if (animateOut && splashRef.current) {
            splashRef.current.classList.add("splash-fade-out");
        }
    }, [animateOut]);

    return (
        <div ref={splashRef} className={"w-screen h-screen bg-gradient-to-b from-[#324587] to-[#0C1121] flex items-center justify-center splash-screen"}>
            <Image
                src="images/logo.svg"
                alt="Logo"
                width={150}
                height={139}
            />
        </div>
    );
}
