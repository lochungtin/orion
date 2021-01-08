import React from 'react';
import { connect } from 'react-redux';
import { w3cwebsocket as W3CWebSocket } from "websocket";

import ToggleSwitch from '../components/ToggleSwitch';
import folder from '../img/folder.png';
import chevL from '../img/left.png';
import file from '../img/file.png'
import { store } from '../redux/store';
import { fsBack, fsSetContent, fsSetDir } from '../redux/action';

const clt = new W3CWebSocket('ws://127.0.0.1:8000');

class Files extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hidden: false,
            searchMode: false,
            selection: [],
        }
    }

    componentDidMount() {
        clt.send('get' + this.props.acc.rootDir);
        clt.onmessage = message => {
            const cmd = message.data.slice(0, 3);
            const payload = message.data.substring(3);
            switch (cmd) {
                case 'cnt':
                    store.dispatch(fsSetContent(JSON.parse(payload)));
                    break;
            }
        }
        store.dispatch(fsSetDir(this.props.acc.rootDir));
    }

    append = folder => this.props.fs.dir + folder + '/';

    back = () => {
        var l = this.props.fs.stack.length;
        if (l > 1)
            clt.send('get' + this.props.fs.stack[l - 2]);
        store.dispatch(fsBack());
    }

    goto = dir => {
        store.dispatch(fsSetDir(dir));
        clt.send('get' + dir);
    }

    jump = dir => {
        if (!this.props.acc.rootDir.includes(dir)) {
            var splt = this.props.fs.dir.split('/').filter(d => d !== '');
            var str = '/';
            splt.slice(0, splt.indexOf(dir) + 1).forEach(d => str += d + '/');
            return str;
        }
        return this.props.acc.rootDir;
    }

    select = select => {
        const arr = [...this.state.selection];
        const index = arr.indexOf(select);
        if (index === -1)
            arr.push(select);
        else
            arr.splice(index, 1);
        this.setState({ selection: arr });
        console.log(arr);
    }

    sortHidden = (a, b) => a.substring(0, 1).indexOf('.') - b.substring(0, 1).indexOf('.');

    tFocus = v => this.setState({ searchMode: v });

    tHidden = () => this.setState({ hidden: !this.state.hidden });

    render() {
        return (
            <div>
                <div className='fileTop'>
                    <button className='fileNavBtn' onClick={this.back}>
                        <img className='fileNavImg' src={chevL} />
                    </button>
                    <div className='fileDirBar'>
                        {this.props.fs.dir.split('/').filter(t => t !== '').map(t => {
                            return (
                                <button onClick={() => this.goto(this.jump(t))} key={t}>
                                    <p className='fileDirBarText noselect'>{'/ ' + t}</p>
                                </button>
                            );
                        })}
                    </div>
                    <div className='fileOptionBar'>
                        <ToggleSwitch checked={this.state.checked} text={this.state.searchMode ? '' : 'Hidden'} toggle={this.tHidden} />
                        <input
                            className='fileSearchbarInput'
                            onFocus={() => this.tFocus(true)}
                            onBlur={() => this.tFocus(false)}
                            placeholder='search ...'
                            type='text'
                        />
                    </div>
                </div>
                <div className='fileContent'>
                    <div className='fileFolders'>
                        {this.props.fs.content.dirs
                            .filter(d => !d.startsWith('.') || this.state.hidden)
                            .sort(this.sortHidden)
                            .map(d => {
                                return (
                                    <button onClick={() => this.goto(this.append(d))} key={d}>
                                        <div className='fileFolder noselect'>
                                            <img className='fileFolderImg' src={folder} alt='folder' />
                                            <p className='fileItemText'>{d.substring(0, 15) + (d.length > 15 ? '...' : '')}</p>
                                        </div>
                                    </button>
                                );
                            })}
                    </div>
                    <div className='fileFiles'>
                        {this.props.fs.content.files
                            .filter(d => !d.startsWith('.') || this.state.hidden)
                            .sort(this.sortHidden)
                            .map(f => {
                                return (
                                    <button onClick={() => this.select(f)} key={f}>
                                        <div className='fileFolder noselect'>
                                            <img className='fileFileImg' src={file} alt='file' />
                                            <p className='fileItemText'>{f}</p>
                                        </div>
                                    </button>
                                );
                            })}
                    </div>
                    <div className='fileMoreInfo'>

                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    acc: state.acc,
    fs: state.fs,
});

export default connect(mapStateToProps)(Files);