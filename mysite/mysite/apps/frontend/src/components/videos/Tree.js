import 'rc-tree/assets/index.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom'; import { connect } from 'react-redux';
import Tree, { TreeNode } from 'rc-tree';
import axios from 'axios';


export class MyTree extends Component {

    sendData = () => {
        this.props.parentCallback(this.state.checkedKeys);
    }

    state = {
        treeData: [],
        checkedKeys: [],
    };

    async getData(directory) {
        const res = await axios.get(`${window.location.origin}/api/v1/server/share?directory=${directory}`);
        const m_data = [];
        res.data.map((node, i) => {
            m_data.push({ name: node.name, key: directory + '/' + node.name })
        });
        this.setState({ treeData: m_data })
    }

    async getNewTreeData(treeData, curKey) {
        const res = await axios.get(`${window.location.origin}/api/v1/server/share?directory=${curKey}`);
        const m_data = [];
        res.data.map((node, i) => {
            m_data.push({ name: node.name, key: curKey + '/' + node.name })
        });
        const loop = (data) => {
            data.forEach((item) => {
                if (curKey.indexOf(item.key) === 0) {
                    if (item.children) {
                        loop(item.children);
                    } else {
                        if (curKey === item.key) {
                            item.children = m_data;
                        }
                    }
                }
            });
        };
        loop(treeData);
        this.setState({ treeData: treeData })
    }

    componentDidMount() {
        this.getData('')
    }

    onSelect = (info) => {
        console.log('selected', info);
    }

    onCheck = (checkedKeys) => {
        this.setState({
            checkedKeys,
        }, () => {
            console.log('this.state.checkedKeys', checkedKeys);
            this.sendData();
        });

    }

    onLoadData = (treeNode) => {
        console.log('load data...');
        return new Promise((resolve) => {
            setTimeout(() => {
                const treeData = [...this.state.treeData];
                this.getNewTreeData(treeData, treeNode.props.eventKey);
                resolve();
            }, 500);
        });
    }

    render() {
        const loop = (data) => {
            return data.map((item) => {
                if (item.children) {
                    return <TreeNode title={item.name} key={item.key}>{loop(item.children)}</TreeNode>;
                }
                return (
                    <TreeNode title={item.name} key={item.key} isLeaf={item.isLeaf}
                        disabled={item.key === '0-0-0'}
                    />
                );
            });
        };
        const treeNodes = loop(this.state.treeData);
        return (

            <div>
                <h2>dynamic render</h2>

                <div className="container" style={{
                    width: 500,
                    height: 200,
                    overflow: 'auto'
                }}>
                    <Tree
                        onSelect={this.onSelect}
                        checkable onCheck={this.onCheck} checkedKeys={this.state.checkedKeys}
                        loadData={this.onLoadData}
                    >
                        {treeNodes}
                    </Tree>
                </div>
            </div>
        );
    }
}


export default connect(null, {})(MyTree);