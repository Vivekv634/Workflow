"use client"

import { auth, workflow } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { Background, Controls, applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';

const Flow = ({ params }) => {
    // window.onbeforeunload = function () {
    //     return "Data will be lost if you leave the page, are you sure?";
    // };
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [pages, setPages] = useState([]);
    const [pageID, setPageID] = useState('');
    const [userId, setUserId] = useState('');

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
    );

    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
    );

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [],
    );

    const addNode = useCallback(() => {
        let newNode = {
            id: `${nodes?.length + 1}`,
            data: { label: `Node ${nodes.length + 1}` },
            position: { x: 0, y: 0 + (nodes.length + 1) * 20 }
        };
        setNodes((nds) => nds.concat(newNode));
    }, [nodes]);

    useEffect(() => {
        const getData = async () => {
            onAuthStateChanged(auth, async (user) => {
                setUserId(user?.uid);
                    const q = query(workflow, where("email", "==", user?.email));
                    const response = await getDocs(q);
                    response.forEach(project => {
                        setPages(project.data().pages);
                        project.data().pages.forEach((page) => {
                            if (page?.pid === params?.pid) {
                                setPageID(page.pid);
                                setNodes(page.nodes);
                                setEdges(page.edges);
                            }
                        })
                    })
                
            })
        }
        getData();
    }, [params])

    const showDetails = () => {
        console.log(nodes);
        console.log(edges);
    }
    const saveChanges = async () => {
        // const docRef = doc(db, "workflow", userId);
        // const updatedPages = await pages.map(page => {
        //     if (page.pid == pageID) {
        //         page.update_timestamp = new Date();
        //     }
        // })
        // console.log(updatedPages);
        // await updateDoc(docRef, {
        //     pages: updatedPages
        // }).then(alert("changes save"))
    }
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <button type="button" onClick={showDetails}>show details</button>
            <button type="button" onClick={addNode}>add node</button>
            <button type="button" onClick={saveChanges}>save</button>
            <ReactFlow nodes={nodes}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={(e) => console.log(e.target.dataset.id)}
                onEdgeClick={(e) => console.log(e.target.dataset.id)}
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    )
}

export default Flow