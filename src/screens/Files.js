import React from 'react';
import { connect } from 'react-redux';

import ToggleSwitch from '../components/ToggleSwitch';
import folder from '../img/folder.png';
import chevL from '../img/left.png';
import fileE from '../img/fileE.png'
import fileF from '../img/fileF.png'
import { fsBack, fsSetDetail, fsSetDir, fsSetSearch } from '../redux/action';
import { store } from '../redux/store';

import './css/files.css';

class Files extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hidden: false,
            searchMode: false,
            selection: '',
        }

        this.handleSearch = this.handleSearch.bind(this);
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

    handleSearch = event => {
        const text = event.target.value;
        if (text.length > 2)
            this.props.clt.send('srq' + JSON.stringify({ dir: this.props.fs.dir, text }));
        else if (this.props.fs.search) 
            this.props.clt.send('get' + this.props.fs.dir);
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

    make = () => Math.floor((1 + Math.random() * 0x10000)).toString(16);

    rnKey = () => this.make() + this.make() + '-' + this.make();
    
    select = select => {
        const selected = this.props.fs.dir + '/' + select;
        if (this.state.selection === selected)
            store.dispatch(fsSetDetail({}));
        else {
            this.props.clt.send('dtl' + selected);
            this.setState({ selection: selected });
        }
    }

    size = bytes => Math.round(this.sizeR(bytes) * 100) / 100 + '' + ['B', 'KB', 'MB', 'GB'][Math.floor(Math.log(bytes) / Math.log(1024))];

    sizeR = bytes => bytes / Math.pow(1024, Math.floor((Math.log(bytes) / Math.log(1024))));

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
                            onChange={this.handleSearch}
                            placeholder='search ...'
                            type='text'
                        />
                    </div>
                </div>
                <div className='fileContent'>
                    {!this.props.fs.search && <div className='fileFolders'>
                        {this.props.fs.content.dirs
                            .filter(d => !d.startsWith('.') || this.state.hidden)
                            .sort((a, b) => a.substring(0, 1).indexOf('.') - b.substring(0, 1).indexOf('.'))
                            .map(d => {
                                return (
                                    <button onClick={() => this.goto(this.append(d))} key={this.rnKey()}>
                                        <div className='fileFolder noselect'>
                                            <img className='fileFolderImg' src={folder} alt='folder' />
                                            <p className='fileItemText'>{d.substring(0, 15) + (d.length > 15 ? '...' : '')}</p>
                                        </div>
                                    </button>
                                );
                            })}
                    </div>}
                    <div className='fileFiles'>
                        {this.props.fs.content.files
                            .filter(d => !d.startsWith('.') || this.state.hidden)
                            .sort(this.sortHidden)
                            .map(f => {
                                return (
                                    <button onClick={() => this.select(f)} key={this.rnKey()}>
                                        <div className='fileFolder noselect'>
                                            <img className='fileFileImg' src={this.state.selection.includes(this.props.fs.dir + '/' + f) ? fileF : fileE} alt='file' />
                                            <p className='fileItemText'>{f}</p>
                                        </div>
                                    </button>
                                );
                            })}
                    </div>
                    <div className='fileMoreInfo'>
                        {this.state.selection && <>
                            <img className='fileInfoPic' src={fileF} alt='file' />
                            <div className='fileInfoContainer'>
                                <p>Size: </p>
                                <p className='fileInfoText'>{this.props.fs.details.size ? this.size(this.props.fs.details.size) : ''}</p>
                            </div>
                            <div className='fileInfoContainer'>
                                <p>L.M. Date: </p>
                                <p className='fileInfoText'>{this.props.fs.details.mTime ? new Date(this.props.fs.details.mTime).toLocaleDateString() : ''}</p>
                            </div>
                            <div className='fileInfoContainer'>
                                <p>L.M. Time: </p>
                                <p className='fileInfoText'>{this.props.fs.details.mTime ? new Date(this.props.fs.details.mTime).toLocaleTimeString() : ''}</p>
                            </div>
                            <div className='fileInfoContainer'>
                                <p>Path: </p>
                                <p className='fileInfoText'>{this.props.fs.details.path}</p>
                            </div>
                        </>}
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