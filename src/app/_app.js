// pages/_app.js
"use client";
import { ApolloProvider } from "@apollo/client";
import client from "../apolloClient";
import { GeistProvider, CssBaseline } from "@geist-ui/core";
import "./globals.css";

function MyApp({ Component, pageProps }) {
	return (
		<GeistProvider>
			<CssBaseline />
			<ApolloProvider client={client}>
				<Component {...pageProps} />
			</ApolloProvider>
		</GeistProvider>
	);
}

export default MyApp;
