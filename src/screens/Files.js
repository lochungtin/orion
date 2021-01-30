import React from 'react';
import { connect } from 'react-redux';

import ToggleSwitch from '../components/ToggleSwitch';
import folder from '../img/folder.png';
import chevL from '../img/left.png';
import fileE from '../img/fileE.png'
import fileF from '../img/fileF.png'
import { store } from '../redux/store';
import { fsBack, fsSetDetail, fsSetDir } from '../redux/action';

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
        this.props.clt.send('get' + this.props.acc.rootDir);
        store.dispatch(fsSetDir(this.props.acc.rootDir));
    }

    append = folder => this.props.fs.dir + '/' + folder;

    back = () => {
        var l = this.props.fs.stack.length;
        if (l > 1)
            this.props.clt.send('get' + this.props.fs.stack[l - 2]);
        store.dispatch(fsBack());
    }

    goto = dir => {
        store.dispatch(fsSetDir(dir));
        this.props.clt.send('get' + dir);
    }

    jump = dir => {
        if (!this.props.acc.rootDir.includes(dir)) {
            const splt = this.props.fs.dir.split('/').filter(d => d !== '');
            let str = '/';
            splt.slice(0, splt.indexOf(dir) + 1).forEach(d => str += d + '/');
            return str;
        }
        return this.props.acc.rootDir;
    }

    select = select => {
        const arr = [...this.state.selection];
        const index = arr.indexOf(this.props.fs.dir + select);
        if (index === -1)
            arr.push(this.props.fs.dir + select);
        else
            arr.splice(index, 1);
        this.setState({ selection: arr });
        if (arr.length === 1)
            this.props.clt.send('dtl' + arr[0]);
        else
            store.dispatch(fsSetDetail({}));
    }

    size = bytes => bytes / Math.pow(1024, Math.floor((Math.log(bytes) / Math.log(1024))));

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
                                            <img className='fileFileImg' src={this.state.selection.includes(this.props.fs.dir + f) ? fileF : fileE} alt='file' />
                                            <p className='fileItemText'>{f}</p>
                                        </div>
                                    </button>
                                );
                            })}
                    </div>
                    <div className='fileMoreInfo'>
                        <p>{this.props.fs.details.path}</p>
                        <p>{this.props.fs.details.size}</p>
                        <p>{this.props.fs.details.bTime}</p>
                        <p>{this.props.fs.details.mTime}</p>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    acc: state.acc,
    clt: state.clt,
    fs: state.fs,
});

export default connect(mapStateToProps)(Files);