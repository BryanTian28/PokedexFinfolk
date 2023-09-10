import { Tooltip } from "@geist-ui/core";

// components/Footer.js
const Footer = () => {
	return (
		<footer className="bg-[#0E1F40] h-14 min-w-[1600px] flex items-center justify-between">
			<p className="text-[#F2F2F2] ml-4">&copy;2023 POKEDEX</p>
			<Tooltip text={"Click to go to the source code on Github"}>
				<p className="text-[#F2F2F2] mr-4">
					<a href="">By Bryan Austin</a>
				</p>
			</Tooltip>
		</footer>
	);
};

export default Footer;
