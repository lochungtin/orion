import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';

import ToggleSwitch from '../components/ToggleSwitch';
import folder from '../img/folder.png';
import chevL from '../img/left.png';
import fileE from '../img/fileE.png'
import fileF from '../img/fileF.png'
import { fsBack, fsSetDetail, fsSetDir, fsSetHidden, fsSetSearch, fsSetSelection, } from '../redux/action';
import { store } from '../redux/store';

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

    make = () => Math.floor((1 + Math.random() * 0x10000)).toString(16);

    rnKey = () => this.make() + this.make() + '-' + this.make();

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

    size = bytes => Math.round(this.sizeR(bytes) * 100) / 100 + '' + ['B', 'KB', 'MB', 'GB'][Math.floor(Math.log(bytes) / Math.log(1024))];

    sizeR = bytes => bytes / Math.pow(1024, Math.floor((Math.log(bytes) / Math.log(1024))));

    tHidden = () => store.dispatch(fsSetHidden(!this.props.fs.hidden));

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
                                    <p className='fileDirBarText noselect'>{'/' + t}</p>
                                </button>
                            );
                        })}
                    </div>
                    <div className='fileOptionBar'>
                        <ToggleSwitch checked={this.props.fs.hidden} text={this.props.fs.search ? '' : 'Hidden'} toggle={this.tHidden} />
                        <input
                            className='fileSearchbarInput'
                            onChange={this.handleSearch}
                            placeholder='search ...'
                            type='text'
                            value={this.props.fs.search}
                        />
                    </div>
                </div>
                <div className='fileContent'>
                    <div className='fileFolders'>
                        {this.props.fs.content.dirs
                            .filter(d => !d.startsWith('.') || this.props.fs.hidden)
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
                    </div>
                    <div className='fileFiles'>
                        {this.props.fs.content.files
                            .filter(d => !d.startsWith('.') || this.props.fs.hidden)
                            .sort(this.sortHidden)
                            .map(f => {
                                return (
                                    <button onClick={() => this.select(f)} key={this.rnKey()}>
                                        <div className='fileFolder noselect'>
                                            <img className='fileFileImg' src={this.props.fs.select === (this.props.fs.dir + '/' + f) ? fileF : fileE} alt='file' />
                                            <p className='fileItemText'>{f}</p>
                                        </div>
                                    </button>
                                );
                            })}
                    </div>
                    <div className='fileMoreInfo'>
                        {this.props.fs.select && <div className='fileTextInfo'>
                            <img className='fileInfoPic' src={fileF} alt='file' />
                            <div className='fileInfoContainer'>
                                <p>Name: </p>
                                <p className='fileInfoText'>{this.props.fs.details.path ? this.getFileName(this.props.fs.select) : ''}</p>
                            </div>
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
                        </div>}
                        {this.props.fs.select &&
                            <div className='fileDownloadBtnContainer'>
                                <button className='fileDownloadBtn' onClick={this.requestFile}>
                                    <p>download</p>
                                </button>
                            </div>
                        }
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