import React from 'react';
import './css/ToggleSwitch.css';

export default class ToggleSwitch extends React.Component {

    onChange = () => this.props.toggle();


    render() {
        return (
            <div className='switchRoot'>
                {this.props.text &&
                    <p className='switchText'>{this.props.text}</p>
                }
                <label className='switch'>
                    <input
                        className='switchInput'
                        checked={this.props.checked}
                        onChange={this.onChange}
                        type='checkbox'
                    />
                    <span className='switchSlider' />
                </label>
            </div>
        );
    }
}