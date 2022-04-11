
import React, {useState, useEffect} from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

const withErrorHandler = ( WrappedComponent, axios ) => {
    return props =>  {

        const [error, setError] = useState(null);

            const reqInterceptor = axios.interceptors.request.use(req => {// clearing the state error before response.
                setError(null);
                return req
            })
            const resInterceptor = axios.interceptors.response.use(res => res, err => {
                setError(err);
            });

        useEffect(() => {
            return () => {
                 // console.log('Will Unmount', this.reqInterceptor, this.resInterceptor);
            axios.interceptors.request.eject(reqInterceptor);
            axios.interceptors.response.eject(resInterceptor);
            }
        }, [reqInterceptor, resInterceptor])
        const errorConfirmedHandler = () => {
            setError(null);
        }

            return (
                <Aux>
                    <Modal 
                        show={error}
                        modalClosed={errorConfirmedHandler}>
                        {/* checking if there is error message or not */}
                       {error ? error.message : null}
                    </Modal>
                    <WrappedComponent {...props}/>
                </Aux>
            );
    }
}

export default withErrorHandler;