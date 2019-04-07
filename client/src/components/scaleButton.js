import './scaleButton.scss';
import React from 'react';
import Modal from 'react-modal';
import Base from './base';
import Button from './button';
import ScaleSvg from '../art/scaleSvg';

export default class ScaleButton extends Base {
    render() {
        const {scaleInfo} = this.state || {};

        return (
            <>
                <Button title='Scale' className='button_headerAction' onClick={() => this.openModal()}>
                    <ScaleSvg />
                    <span className='button_label'>Scale</span>
                </Button>

                {scaleInfo && (
                    <Modal isOpen={true} className='modal_modal' overlayClassName='modal_overlay' onRequestClose={() => this.close()}>
                        <div>
                            <div className='scaleButton_label'>Desired count</div>
                            <input
                                type='number'
                                className='scaleButton_input'
                                min="0"
                                defaultValue={scaleInfo.spec.replicas || 0}
                                onChange={x => this.setState({value: parseInt(x.target.value, 10)})}
                            />

                            <div className='modal_actions'>
                                <Button className='button' onClick={() => this.scale()}>Scale</Button>
                                <Button className='button_negative' onClick={() => this.close()}>Cancel</Button>
                            </div>
                        </div>
                    </Modal>
                )}
            </>
        );
    }

    async openModal() {
        const {namespace, name, scaleApi} = this.props;
        const scaleInfo = await scaleApi.get(namespace, name);
        this.setState({scaleInfo});
    }

    async scale() {
        const {scaleApi} = this.props;
        const {value, scaleInfo} = this.state || {};
        if (value == null) return;

        scaleInfo.spec.replicas = value;
        await scaleApi.put(scaleInfo);

        this.close();
    }

    close() {
    // Use setTimeout to prevent the following React warning:
    // "Warning: Can't perform a React state update on an unmounted component."
        setTimeout(() => this.setState({scaleInfo: null}), 0);
    }
}
