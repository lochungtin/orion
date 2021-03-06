import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';

import ToggleSwitch from '../components/ToggleSwitch';
import folder from '../img/icon/folder.png';
import chevL from '../img/icon/left.png';
import fileE from '../img/icon/fileE.png'
import fileF from '../img/icon/fileF.png'
import { fsBack, fsSetDetail, fsSetDir, fsSetFocus, fsSetHidden, fsSetSearch, fsSetSelection, } from '../redux/action';
import { store } from '../redux/store';
import { size } from '../utils/size';
import { rnKey } from '../utils/randomKey';

import './css/files.css';

class Files extends React.Component {

    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        const dir = this.props.fs.dir || this.props.acc.rootDir
        store.dispatch(fsSetDir(dir));
        if (this.props.fs.search)
            this.props.clt.send('srq' + JSON.stringify({ dir, text: this.props.fs.search }));
        else
            this.props.clt.send('get' + dir);
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
        this.setState({ text: '' });
    }

    handleSearch = event => {
        const text = event.target.value;
        store.dispatch(fsSetSearch(text));
        if (text.length > 2)
            this.props.clt.send('srq' + JSON.stringify({ dir: this.props.fs.dir, text }));
        else
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

    getFileName = path => path.substring(path.lastIndexOf('/') + 1);

    requestFile = () => {
        axios.get(`http://${window.location.hostname}:42072${this.props.fs.select}`, { responseType: 'blob', timeout: 30000 })
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');

                link.href = url;
                link.setAttribute('download', this.getFileName(this.props.fs.select));

                document.body.appendChild(link);

                link.click();

                link.parentNode.removeChild(link);
            })
    }

    select = select => {
        const selected = this.props.fs.dir + '/' + select;
        if (this.props.fs.select === selected) {
            store.dispatch(fsSetDetail({}));
            store.dispatch(fsSetSelection(''));
        }
        else {
            this.props.clt.send('dtl' + selected);
            store.dispatch(fsSetSelection(selected));
        }
    }

    tHidden = () => store.dispatch(fsSetHidden(!this.props.fs.hidden));

    render() {
        return (
            <div>
                <div className='row fileTop'>
                    <button className='fileNavBtn' onClick={this.back}>
                        <img className='fileNavImg' src={chevL} />
                    </button>
                    <div className='row fileDirBar' style={{ justifyContent: 'flex-start' }}>
                        {this.props.fs.dir.split('/').filter(t => t !== '').map(t => {
                            return (
                                <button onClick={() => this.goto(this.jump(t))} key={t}>
                                    <p className='fileDirBarText noselect'>{'/' + t}</p>
                                </button>
                            );
                        })}
                    </div>
                    <div className='row fileOptionBar'>
                        <ToggleSwitch checked={this.props.fs.hidden} text={this.props.fs.focus ? '' : 'Hidden'} toggle={this.tHidden} />
                        <input
                            className='fileSearchbarInput'
                            onChange={this.handleSearch}
                            onFocus={() => store.dispatch(fsSetFocus(true))}
                            onBlur={() => store.dispatch(fsSetFocus(false))}
                            placeholder='search ...'
                            type='text'
                            value={this.props.fs.search}
                        />
                    </div>
                </div>
                <div className='row fileContent'>
                    <div className='col fileFolders' style={{ justifyContent: 'flex-start' }}>
                        {this.props.fs.content.dirs
                            .filter(d => !d.startsWith('.') || this.props.fs.hidden)
                            .sort((a, b) => a.substring(0, 1).indexOf('.') - b.substring(0, 1).indexOf('.'))
                            .map(d => {
                                return (
                                    <button onClick={() => this.goto(this.append(d))} key={rnKey()}>
                                        <div className='fileFolder noselect'>
                                            <img className='fileFolderImg' src={folder} alt='folder' />
                                            <p className='fileItemText'>{d.substring(0, 15) + (d.length > 15 ? '...' : '')}</p>
                                        </div>
                                    </button>
                                );
                            })}
                    </div>
                    <div className='col fileFiles' style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                        {this.props.fs.content.files
                            .filter(d => !d.startsWith('.') || this.props.fs.hidden)
                            .sort(this.sortHidden)
                            .map(f => {
                                return (
                                    <button onClick={() => this.select(f)} key={rnKey()}>
                                        <div className='fileFolder noselect'>
                                            <img className='fileFileImg' src={this.props.fs.select === (this.props.fs.dir + '/' + f) ? fileF : fileE} alt='file' />
                                            <p className='fileItemText'>{f}</p>
                                        </div>
                                    </button>
                                );
                            })}
                    </div>
                    <div className='col fileMoreInfo'>
                        {this.props.fs.select && <>
                            <div className='col fileTextInfo'>
                                <img className='fileInfoPic' src={fileE} alt='file' />
                                <div className='row fileInfoContainer' style={{ alignItems: 'flex-start' }}>
                                    <p>Name: </p>
                                    <p className='fileInfoText'>{this.props.fs.details.path ? this.getFileName(this.props.fs.select) : ''}</p>
                                </div>
                                <div className='row fileInfoContainer' style={{ alignItems: 'flex-start' }}>
                                    <p>Size: </p>
                                    <p className='fileInfoText'>{this.props.fs.details.size ? size(this.props.fs.details.size) : ''}</p>
                                </div>
                                <div className='row fileInfoContainer' style={{ alignItems: 'flex-start' }}>
                                    <p>L.M. Date: </p>
                                    <p className='fileInfoText'>{this.props.fs.details.mTime ? new Date(this.props.fs.details.mTime).toLocaleDateString() : ''}</p>
                                </div>
                                <div className='row fileInfoContainer' style={{ alignItems: 'flex-start' }}>
                                    <p>L.M. Time: </p>
                                    <p className='fileInfoText'>{this.props.fs.details.mTime ? new Date(this.props.fs.details.mTime).toLocaleTimeString() : ''}</p>
                                </div>
                                <div className='row fileInfoContainer' style={{ alignItems: 'flex-start' }}>
                                    <p>Path: </p>
                                    <p className='fileInfoText'>{this.props.fs.details.path}</p>
                                </div>
                            </div>
                            <div className='row fileDownloadBtnContainer'>
                                <button className='row fileDownloadBtn' onClick={this.requestFile} style={{ justifyContent: 'center' }}>
                                    <p>download</p>
                                </button>
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