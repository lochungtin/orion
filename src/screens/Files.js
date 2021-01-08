import React from 'react';
import { connect } from 'react-redux';

import ToggleSwitch from '../components/ToggleSwitch';
import folder from '../img/folder.png';
import chevL from '../img/left.png';
import file from '../img/file.png'
import { store } from '../redux/store';
import { setDirectory } from '../redux/action';

class Files extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dir: '/',
            hidden: false,
            searchMode: false,
            selection: [],
            stack: [],
            root: '/',
        }
    }

    componentDidMount() {
        const client = this.props.connection.client;
        client.send('ini');
        client.onmessage = message => {
            const cmd = message.data.slice(0, 3);
            const payload = message.data.substring(3);
            console.log(message.data);
            switch (cmd) {
                case 'dir':
                    if (this.state.root === '/')
                        this.setState({ root: payload });
                    this.setState({ dir: payload });
                    client.send('get' + payload);
                    break;
                case 'cnt':
                    store.dispatch(setDirectory(JSON.parse(payload)));
                    break;
            }
        }
    }

    append = folder => {
        console.log('go to : ' + folder);
        return this.state.dir + folder + '/';
    }

    back = () => {
        if (this.state.stack.length !== 0) {
            var stack = [...this.state.stack];
            const newDir = stack.pop();

            this.props.connection.client.send('get' + newDir);
            this.setState({ dir: newDir, stack: stack });
        }
    }

    goto = dir => {
        var stack = [...this.state.stack];
        stack.push(this.state.dir);

        this.props.connection.client.send('get' + dir);
        this.setState({ dir: dir, stack: stack });
    }

    jump = dir => {
        console.log('jump to: ' + dir);
        if (!this.state.root.includes(dir)) {
            var splt = this.state.dir.split('/').filter(d => d !== '');
            var str = '/';
            splt.slice(0, splt.indexOf(dir) + 1).forEach(d => str += d + '/');
            return str;
        }
        return this.state.root;
    }

    select = select => {
        const arr = [...this.state.selection];
        const index = arr.indexOf(select);
        if (index === -1)
            arr.push(select);
        else
            arr.splice(index, 1);
        this.setState({ selection: arr });
    }

    sortHidden = (a, b) => {
        if (a.startsWith('.'))
            return 1;
        if (b.startsWith('.'))
            return -1;
        return 0;
    }

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
                        {this.state.dir.split('/').filter(t => t !== '').map(t => {
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
                        {this.props.directories.dirs
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
                        {this.props.directories.files
                            .filter(d => !d.startsWith('.') || this.state.hidden)
                            .sort(this.sortHidden)
                            .map(f => {
                                return (
                                    <button onClick={() => this.select(f)} key={file}>
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
    connection: state.connection,
    directories: state.directories,
});

export default connect(mapStateToProps)(Files);