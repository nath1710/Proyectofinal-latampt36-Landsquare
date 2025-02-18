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
    SiGooglemaps,
    SiPostgresql,
} from "react-icons/si";

function Techstack() {
    return (
        <div>
            <div className="d-flex gap-2 flex-wrap justify-content-center align-items-center" style={{ color: "white", fontSize: "40px" }}>
                <div >
                    <DiHtml5 />
                </div>
                <div  >
                    <DiCss3 />
                </div>
                <div >
                    <SiBootstrap />
                </div>
                <div  >
                    <DiJavascript1 />
                </div>
                <div >
                    <DiReact />
                </div>
                <div >
                    <DiPython />
                </div>
                <div >
                    <SiFlask />
                </div>
                <div >
                    <DiGithubBadge />
                </div>
                <div >
                    <DiGit /><br />
                </div>
                <div >
                    <BiLogoVisualStudio />
                </div>
                <div >
                    <SiGooglemaps />
                </div>
                <div >
                    <SiPostgresql />
                </div>
                <div >
                    <SiCloudinary />
                </div>
            </div>
        </div>
    );
}

export default Techstack;