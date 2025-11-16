import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./ControlPanel.css";

export default function D3Graph({
    barCount = 50,
    lerpSpeed = 0.1 // smaller = smoother
} = {}) {
    const svgRef = useRef(null);
    const animationRef = useRef(null);
    const lastValuesRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const svgEl = svgRef.current;
        if (!svgEl) return;

        const width = 700;
        const height = 240;
        const barGap = 2;
        const barWidth = Math.max(2, Math.floor((width - (barCount - 1) * barGap) / barCount));

        const svg = d3.select(svgEl);
        svg.selectAll("*").remove();
        svg.attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        // Rainbow colors
        const colorScale = d3.scaleSequential()
            .domain([0, barCount - 1])
            .interpolator(d3.interpolateRainbow);

        const colors = d3.range(barCount).map(i => colorScale(i));

        const bars = svg.append("g").attr("class", "bars");

        bars.selectAll("rect")
            .data(d3.range(barCount))
            .enter()
            .append("rect")
            .attr("x", (_, i) => i * (barWidth + barGap))
            .attr("y", height)
            .attr("width", barWidth)
            .attr("height", 0)
            .attr("fill", (_, i) => colors[i])
            .attr("rx", 3);

        // Initial heights
        lastValuesRef.current = new Array(barCount).fill(0);

        const animate = () => {
            const last = lastValuesRef.current;

            // Generate random target heights for each bar
            const targets = last.map(() => Math.random());

            // Lerp from last value to target
            for (let i = 0; i < barCount; i++) {
                last[i] = last[i] + (targets[i] - last[i]) * lerpSpeed;
            }

            bars.selectAll("rect")
                .data(last)
                .attr("y", d => height - d * height)
                .attr("height", d => Math.max(2, d * height));

            if (isPlaying) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        const handleClick = (e) => {
            const id = e.target.id;
            if (id === "play" || id === "process_play") {
                setIsPlaying(true);
            } else if (id === "stop") {
                setIsPlaying(false);
            }
        };

        document.addEventListener("click", handleClick);

        if (isPlaying) animationRef.current = requestAnimationFrame(animate);

        return () => {
            document.removeEventListener("click", handleClick);
            cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, barCount, lerpSpeed]);

    return (
        <div className="graph-container">
            <svg ref={svgRef}></svg>
        </div>
    );
}


