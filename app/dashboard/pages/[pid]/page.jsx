"use client";

import { auth, db, workflow } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Image from 'next/image';
import CloseIcon from '@/public/close.svg';
import AddIcon from '@/public/add.svg';
import { Tooltip } from 'react-tooltip'
import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { Background, applyNodeChanges, applyEdgeChanges, addEdge, Panel, ReactFlowProvider, Controls } from 'reactflow';
import "reactflow/dist/style.css";
import 'react-tooltip/dist/react-tooltip.css'
import Select from 'react-select';
import { flowContext } from '@/Context/flowContext';
import { uid } from 'uid';

const nodeTypeList = [
    {
        "label": "Default Node",
        "value": "default",
        "className": "default"
    },
    {
        "label": "Input Node",
        "value": "input",
        "className": "input"
    },
    {
        "label": "Output Node",
        "value": "output",
        "className": "output"
    },
    {
        "label": "Annotation",
        "value": "default",
        "className": "annotation"
    }
];

const Flow = ({ params }) => {
    window.onbeforeunload = function () {
        return "Data will be lost if you leave the page, are you sure?";
    };
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [pages, setPages] = useState([]);
    const [pageID, setPageID] = useState('');
    const [userId, setUserId] = useState('');
    const [nodeId, setNodeId] = useState('');
    const [editName, setEditName] = useState('');
    const [nodeName, setNodeName] = useState('');
    const [pageName, setPageName] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [addNodePopup, setAddNodePopup] = useState(false);
    const [nodeSelect, setNodeSelect] = useState('');

    useEffect(() => {
        setNodes(nodes)
    }, [nodes, setNodes])

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes],
    );

    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges],
    );

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const handleAddNode = useCallback(() => {
        let newNode = {
            id: `${uid(12)}`,
            data: {
                label: nodeName
            },
            type: nodeSelect?.value,
            className: nodeSelect?.className,
            position: { x: 0, y: 0 + (nodes.length + 1) * 50 }
        };
        setNodes((nds) => nds.concat(newNode));
        setIsSaved(false);
        setAddNodePopup(false);
        setNodeName('');
        setNodeSelect('');
    }, [nodes, setNodes, nodeName, nodeSelect]);

    useEffect(() => {
        const getData = async () => {
            onAuthStateChanged(auth, async (user) => {
                const q = query(workflow, where("email", "==", user?.email));
                const response = await getDocs(q);
                response.forEach(project => {
                    setUserId(project?.id)
                    setPages(project.data().pages);
                    project.data().pages.forEach((page) => {
                        if (page?.pid === params?.pid) {
                            setIsSaved(true);
                            setPageName(page.pname);
                            setPageID(page.pid);
                            setNodes(page.nodes);
                            setEdges(page.edges);
                        }
                    })
                })

            })
        }
        getData();
    }, [params, setNodes, setEdges])

    const showDetails = () => {
        console.log(nodes);
        console.log(edges);
    }
    const saveChanges = async () => {
        try {
            const docRef = doc(db, "workflow", userId);
            let updatedPages = pages.map(page => {
                if (page.pid == pageID) {
                    page.nodes = nodes;
                    page.edges = edges;
                    page.update_timestamp = Date();
                    return page;
                }
            })
            await updateDoc(docRef, {
                pages: updatedPages
            }).then(setIsSaved(true), alert("Changes has beed saved!"))
        } catch (error) {
            console.error(error);
        }
    }

    const handleEditNode = (e) => {
        e.preventDefault();
        let updatedNode = nodes.map(node => {
            if (node.id == nodeId) {
                node.data.label = editName;
                return node;
            }
        })
        setNodes(nodes => {
            nodes.map(node => {
                if (node.id == nodeId) {
                    return updatedNode;
                }
                return node;
            })
        });
    }

    return (
        <ReactFlowProvider>
            <flowContext.Provider value={{ nodes, setNodes, edges, setEdges }}>
                <div className='h-screen w-screen'>
                    <Panel position='bottom-center' className='sm:flex sm:justify-center w-screen md:w-auto'>
                        <section className='bg-blue-100 p-1 w-11/12 rounded-lg flex justify-center'>
                            <ul className='flex grow md:grow-0 justify-evenly'>
                                <li data-tooltip-id="tooltip" data-tooltip-content="Input Node" className='pageBottomButtonCSS'><Image src={AddIcon} alt='add node' /></li>
                                <li data-tooltip-id="tooltip" data-tooltip-content="Add Node" className='pageBottomButtonCSS' onClick={() => { setAddNodePopup(!addNodePopup) }}><Image src={AddIcon} alt='add node' /></li>
                                <li data-tooltip-id="tooltip" data-tooltip-content="Simple Node" className='pageBottomButtonCSS' onClick={() => showDetails()}><Image src={AddIcon} alt='add node' /></li>
                                <Tooltip id="tooltip" />
                            </ul>
                        </section>
                    </Panel>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={(e) => { setNodeId(e.target.dataset.id), setEditName(e.target.innerText), console.log(e.target.dataset.id) }}
                        fitView >
                        <Background />
                        <Controls />
                        <section className={`absolute ${addNodePopup ? "block" : "hidden"} w-screen h-screen z-10 flex justify-center items-center`} >
                            <div className={`bg-green-200 p-3 rounded-lg ${addNodePopup && "shadow-2xl"}`}>
                                <header className='flex justify-between w-full items-center'>
                                    <p className="font-semibold text-xl">Add Node</p>
                                    <button type="button" className='bg-green-400 rounded-md' onClick={() => { setAddNodePopup(!addNodePopup) }}><Image src={CloseIcon} alt='close add node section' /></button>
                                </header>
                                <form onSubmit={e => e.preventDefault()}>
                                    <input type="text" placeholder='Enter Node Name' className='input block' value={nodeName} onChange={e => setNodeName(e.target.value)} required={true} />
                                    <Select options={nodeTypeList} onChange={setNodeSelect} defaultValue={nodeSelect} value={nodeTypeList.find(nodeType => nodeType.value === nodeSelect)} required={true} />
                                    <button type="submit" className='p-1 bg-blue-200 w-full mt-2 rounded-sm' onClick={handleAddNode}>Add</button>
                                </form>
                            </div>
                        </section>
                    </ReactFlow>
                </div>
            </flowContext.Provider>
        </ReactFlowProvider>
    )
}

export default Flow