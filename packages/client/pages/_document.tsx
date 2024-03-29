import Document, {Head, Html, Main, NextScript} from "next/document";
import {ServerStyleSheet} from "styled-components";

export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) =>
                        sheet.collectStyles(<App {...props} />),
                });

            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                styles: (
                    <>
                        <link
                            rel={"stylesheet"}
                            href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;600;700&display=swap"
                        />
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            };
        } finally {
            sheet.seal();
        }
    }

    render() {
        return (
            <Html>
                <Head>
                    <script
                        async
                        defer
                        src="https://scripts.simpleanalyticscdn.com/latest.js"
                    ></script>
                </Head>
                <body>
                <Main/>
                <NextScript/>
                <div id="modal-root"></div>
                </body>
            </Html>
        );
    }
}
