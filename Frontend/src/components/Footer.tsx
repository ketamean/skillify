import { ReactElement } from "react";

interface FooterProps {
    privacyPolicyLink?: string;
    termsOfServiceLink?: string;
}

export default function Footer(props: FooterProps): ReactElement {
    return (
        <footer className="w-full bg-deepteal flex flex-col gap-y-4 px-[4%] py-6">
            <div className="grid
                grid-cols-[30%-40%-30%] grid-rows-2 gap-y-6
                md:grid-cols-4 md:grid-rows-[auto_auto] md:gap-y-0"
            >
                <div className="w-full h-full flex items-start justify-start text-white! container col-start-1 col-span-1"
                >
                    <a href="#"
                        className="text-decoration-none! text-white! font-bold! text-3xl! hover:text-white! hover:no-underline!"
                    >
                        <span>
                            Skillify
                        </span>
                    </a>
                </div>
                <div className="col-span-1 flex flex-col gap-y-1 items-start text-white!
                    col-start-3 row-start-1
                    md:col-start-3 md:row-start-1
                ">
                    <h3>About us</h3>
                    <div className="text-sm flex flex-col gap-y-1">
                        <p>Member 1</p>
                        <p>Member 2</p>
                        <p>Member 3</p>
                        <p>Member 4</p>
                    </div>
                </div>
                <div className="col-span-1 flex flex-col gap-y-1 items-start text-white!
                    col-start-3 row-start-2
                    md:col-start-4 md:row-start-1
                ">
                    <h3>Contact us</h3>
                    <div className="text-sm flex flex-col gap-y-1">
                        <p>(028) 1800 1234</p>
                    </div>
                </div>
            </div>

            <div className="container border-b-1 border-b-vibrant-green"></div>

            <div className="container flex
                flex-col
                md:flex-row">
                <span>© Skillshare, Inc. 2025</span>
                <a href={props.privacyPolicyLink? props.privacyPolicyLink : "#"}
                    className="hover:text-vibrant-green! text-white! underline! decoration-solid!
                    md:before:mx-4 md:before:content-['•'] md:no-underline!"
                >
                    Privacy Policy
                </a>
                <a href={props.termsOfServiceLink? props.termsOfServiceLink : "#"}
                    className="hover:text-vibrant-green! text-white! underline! decoration-solid!
                    md:before:mx-4 md:before:content-['•'] md:no-underline!"
                >
                    Terms of Service
                </a>
            </div>
        </footer>
    )
}