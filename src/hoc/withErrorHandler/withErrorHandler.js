
import React, {useState, useEffect} from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

import useErrorHandler from '../../hooks/http-error-handler';
const withErrorHandler = ( WrappedComponent, axios ) => {
    return props =>  {

        const [error, clearError] = useErrorHandler(axios);

            return (
                <Aux>
                    <Modal 
                        show={error}
                        modalClosed={clearError}>
                        {/* checking if there is error message or not */}
                       {error ? error.message : null}
                    </Modal>
                    <WrappedComponent {...props}/>
                </Aux>
            );
    }
}

export default withErrorHandler;