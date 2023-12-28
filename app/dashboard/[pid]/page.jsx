"use client"

import { auth, workflow } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getDocs, query, where } from 'firebase/firestore';
import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { Background, Controls, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

const Flow = ({ params }) => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
    );

    useEffect(() => {
        const getData = async () => {
            onAuthStateChanged(auth, async user => {
                const q = query(workflow, where("email", "==", user?.email));
                const response = await getDocs(q);
                response.forEach(project => {
                    project.data().pages.forEach((page) => {
                        if (page.pid === params.pid) {
                            setNodes(page.nodes);
                            setEdges(page.edges);
                        }
                    })
                })
            })
        }
        getData();
    },[])
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow nodes={nodes}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                fitView>
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    )
}

export default Flow