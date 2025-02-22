import { ReactElement } from "react";

interface FooterProps {
    privacyPolicyLink?: string;
    termsOfServiceLink?: string;
}

export default function Footer(props: FooterProps): ReactElement {
    return (
        <footer className="w-full bg-deepteal flex flex-col gap-y-4 px-[4%] py-6">
            <div className="grid
                grid-cols-1
                lg:grid-cols-4"
            >
                <div className="w-full h-full flex items-center text-white! container
                    col-span-1 justify-start
                    lg:col-span-1"
                >
                    <a href="#"
                        className="text-decoration-none! text-white! font-bold! text-3xl! hover:text-white! hover:no-underline!"
                    >
                        <span>
                            Skillify
                        </span>
                    </a>
                </div>
                <div className="col-start-3 col-span-1 flex flex-col items-end justify-center text-white!">
                    <h3>About us</h3>
                </div>
                <div className="col-span-1 flex flex-col items-end justify-center text-white!">
                    <h3>Contact us</h3>
                </div>
            </div>

            <div className="container border-b-1 border-b-vibrant-green"></div>

            <div className="container">
            © Skillshare, Inc. 2025
            </div>
        </footer>
    )
}