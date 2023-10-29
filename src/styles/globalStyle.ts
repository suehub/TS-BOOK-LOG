import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
    ${reset}
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        text-decoration: none;
    }
    body{
        background-color: #f8f9fa;
        list-style: none;
        box-sizing: border-box;
    }
    button {
        cursor: pointer;
    }
    footer {
        background-color: #f8f9fa;

    }

`;

export default GlobalStyle;
