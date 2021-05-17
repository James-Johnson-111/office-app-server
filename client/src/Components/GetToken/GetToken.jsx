import react, { Component, useRef } from 'react';

import './GetToken.css';
import Cookies from 'js-cookie';
import Loading from '../UI/Loading/Loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as PasswordHash from 'password-hash';
import QRcode from 'qrcode';
import axios from '../../axios-instance';

class GetToken extends Component {

    constructor( props )
    {

        super( props );
        this.state = {
            getTokenContent: null,
            initialNumber: 0,
            loading: true
        }

    }

    componentDidMount()
    {

        let content = <> <form onSubmit={this.getToken}>
                <h3 className="mb-3 font-weight-bold text-uppercase text-center">press button & get your token</h3>
                <div className="text-center">
                    <button type="submit" className="btn btn-sm w-50">Get Token</button>
                </div>
            </form> 
        </>
        this.setState( { loading: false, getTokenContent: content } );

    }

    getToken = ( event ) => {

        event.preventDefault();
        let initialNumber = this.state.initialNumber;
        let addition = initialNumber + 1000;
        this.setState( { initialNumber: addition } );
        let token = addition.toString();
        let getLenth = token.length;
        let tokenTXT = null;
        if( getLenth == 1 )
        {
            tokenTXT = '000' + token;
        }

        if( getLenth == 2 )
        {
            tokenTXT = '00' + token;
        }

        if( getLenth == 3 )
        {
            tokenTXT = '0' + token;
        }

        if( getLenth == 4 )
        {
            tokenTXT = token;
        }
        let hashedTokenNo = "056723" + tokenTXT + "LBOFF";
        let Url = 'https://labofficial.surge.sh/#/welcomecandidate/' + hashedTokenNo;
        QRcode.toDataURL(Url).then( response => {

            var fullTime = null;

            const date = new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var fullTimes = hours + ':' + minutes + ' ' + ampm;
            fullTime = fullTimes.toString();

            const formsData = new FormData();
            formsData.append('token', tokenTXT);
            formsData.append('time', fullTime);
            axios.post( '/storetoken', formsData ).then( response => {

                console.log('token stored');

            } ).catch( error => {

                console.log( error );

            } )

            let content = null;
            content = <>
                <div className="container-fluid" id="tokenContent">
                    <div className="row">
                        <div className="col-6">
                            <img src={response} width="100%" />
                        </div>
                        <div className="col-6 text-center d-grid">
                            <div>
                                <h5 className="text-uppercase font-weight-bold">Labofficial</h5>
                                <h4 className="text-uppercase font-weight-bold" style={{ 'fontFamily': 'Exo', 'fontSize': '40px' }}>{tokenTXT}</h4>
                                <h6 className="text-uppercase font-weight-bold" style={{ 'fontFamily': 'Exo' }}> {fullTime} </h6>
                            </div>
                        </div>
                    </div>
                </div>
            </>

            this.setState({ getTokenContent: content });

            setTimeout( () => {

                var backup = document.body.innerHTML;
                var Pcontent = document.getElementById('tokenContent').innerHTML;
                document.body.innerHTML = Pcontent;
                window.print();
                document.body.innerHTML = backup;

            }, 1000 )

            setTimeout(() => {

                content = <>
                    <form onSubmit={this.getToken}>
                        <h3 className="mb-3 font-weight-bold text-uppercase text-center">press button & get your token</h3>
                        <div className="text-center">
                            <button type="submit" className="btn btn-sm w-50">Get Token</button>
                        </div>
                    </form>
                </>

            }, 3000);
            this.setState({ getTokenContent: content });
            
        } )

    }

    render()
    {

        return(

            <>
                <Loading show={this.state.loading} />
                <div className="GetToken d-grid" id="tokenPage">
                    <div className="GetToken-inner d-flex justify-content-center" id="frame">
                        <div className="GetToken-content" id="content">
                            {this.state.getTokenContent}
                        </div>
                    </div>
                </div>
                <ToastContainer autoClose={3000} />
            </>

        );

    }

}

// const Example = () => {
//     const componentRef = useRef();
//     const HandlePrint = useReactToPrint(
//         {
//             content: () => componentRef.current
//         }
//     )

//     return (
//         <>
            
//         </>
//     )
// }

export default GetToken;