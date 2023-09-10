"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search } from "@geist-ui/icons";
import { useState } from "react";
import Link from "next/link";
import { Image, Text } from "@geist-ui/core";

export default function SearchPage() {
	const [toSearch, setToSearch] = useState();
	const [numSearch, setNumSearch] = useState();

	const handleInputChange = (value) => {
		if (value < -68) {
			value = -68;
		} else if (value > 905) {
			value = 905;
		}

		setNumSearch(value);
	};

	return (
		<div className="min-w-screen min-h-screen bg-[#F2F2F2] flex justify-center">
			<div className="max-w-[1600px]">
				<Navbar />
				<div className="min-h-screen flex justify-center">
					<div className="flex flex-col text-center items-center">
						<div className="bg-[#0E1F40] w-[300px] h-[60px] flex align-middle items-center rounded-lg mt-8">
							<input
								className="h-[30px] ml-2 text-[#0E1F40] border rounded-md pl-2"
								placeholder="Input Pokemon Name"
								onChange={(event) => setToSearch(event.target.value)}
							/>
							<Link href={`/search/[name]`} as={`/search/${toSearch}`}>
								<Search className="ml-4" />
							</Link>
						</div>
						<Text style={{ color: "#0E1F40", fontSize: "20px", marginTop: "2px" }}>
							OR
						</Text>
						<div className="bg-[#0E1F40] w-[300px] h-[60px] flex align-middle items-center rounded-lg mt-8">
							<input
								type="number"
								className="h-[30px] ml-2 text-[#0E1F40] border rounded-md pl-2 w-60"
								placeholder="Input Pokedex Number"
								value={numSearch}
								onChange={(event) => handleInputChange(event.target.value)}
								min={"-68"}
								max={"905"}
							/>
							<Link href={`/details/[num]`} as={`/details/${numSearch}`}>
								<Search className="ml-4" />
							</Link>
						</div>
						<Image
							src="https://media.tenor.com/q63GikDmOygAAAAd/pokemon-pikachu.gif"
							marginTop={"20px"}
						/>
					</div>
				</div>
				<Footer />
			</div>
		</div>
	);
}
