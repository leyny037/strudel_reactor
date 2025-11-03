import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./ControlPanel.css";

export default function D3Graph() {
    const svgRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const animationRef = useRef(null);
    const tRef = useRef(0);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const width = 700;
        const height = 200;

        svg.selectAll("*").remove();
        svg.attr("viewBox", `0 0 ${width} ${height}`)
           .attr("preserveAspectRatio", "xMidYMid meet");

        // Define rainbow gradient
        const defs = svg.append("defs");
        const gradient = defs.append("linearGradient")
            .attr("id", "rainbowGradient")
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "0%");
        
        const colors = ["red", "orange", "yellow", "green", "cyan", "blue", "violet"];
        colors.forEach((c, i) => {
            gradient.append("stop")
                .attr("offset", `${(i / (colors.length - 1)) * 100}%`)
                .attr("stop-color", c);
        });

        // Wave path
        const path = svg.append("path")
            .attr("fill", "none")
            .attr("stroke", "url(#rainbowGradient)")
            .attr("stroke-width", 3);

        const x = d3.scaleLinear().domain([0, 100]).range([0, width]);
        const y = d3.scaleLinear().domain([-1, 1]).range([height, 0]);

        const line = d3.line()
            .x(d => x(d.x))
            .y(d => y(d.y))
            .curve(d3.curveBasis);

        // Animation loop
        const animate = () => {
            const data = d3.range(0, 100).map(i => ({
                x: i,
                y: Math.sin((i / 5) + tRef.current) * Math.cos((i / 15) + tRef.current / 2)
            }));

            path.datum(data).attr("d", line);
            tRef.current += 0.05;

            if (isPlaying) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        // Handle button clicks from ControlPanel
        const handleButtonClick = (e) => {
            const id = e.target.id;
            if (id === "play" || id === "process_play") {
                if (!isPlaying) {
                    setIsPlaying(true);
                }
            } else if (id === "stop") {
                setIsPlaying(false);
            }
        };

        document.addEventListener("click", handleButtonClick);

        // Start / stop animation loop depending on state
        if (isPlaying) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(animationRef.current);
        }

        return () => {
            document.removeEventListener("click", handleButtonClick);
            cancelAnimationFrame(animationRef.current);
            svg.selectAll("*").remove();
        };
    }, [isPlaying]);

    return (
        <div className="graph-container">
            <h3 className="panel-title">D3 Graph</h3>
            <svg ref={svgRef}></svg>
        </div>
    );
}
