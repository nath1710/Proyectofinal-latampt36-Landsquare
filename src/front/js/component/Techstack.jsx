import React from "react";
import { BiLogoVisualStudio } from "react-icons/bi";
import {
    DiHtml5,
    DiCss3,
    DiJavascript1,
    DiReact,
    DiPython,
    DiGit,
    DiGithubBadge,
} from "react-icons/di";
import {
    SiBootstrap,
    SiCloudinary,
    SiFlask,
    SiGoogleauthenticator,
    SiGooglemaps,
    SiMysql,
    SiPostgresql,
} from "react-icons/si";

function Techstack() {
    return (
        <div className="d-flex gap-2 wrap" style={{ justifyContent: "center", paddingBottom: "50px", color: "white", fontSize: "40px" }}>
            <div >
                <DiHtml5 />
            </div>
            <div  >
                <DiCss3 />
            </div>
            <div  >
                <DiJavascript1 />
            </div>
            <div >
                <DiReact />
            </div>
            <div >
                <SiBootstrap />
            </div>
            <div >
                <DiGithubBadge />
            </div>
            <div >
                <DiPython />
            </div>
            <div >
                <SiFlask />
            </div>
            <div >
                <SiGooglemaps />
            </div>
            <div >
                <SiPostgresql />
            </div>
            <div >
                <DiGit />
            </div>
            <div >
                <SiCloudinary />
            </div>
            <div >
                <BiLogoVisualStudio />
            </div>
            <div >
                <SiGoogleauthenticator />
            </div>
        </div>
    );
}

export default Techstack;