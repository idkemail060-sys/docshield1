import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface RadialGaugeProps {
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  decision?: string;
  size?: number;
  strokeWidth?: number;
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({
  score,
  riskLevel,
  decision,
  size = 200,
  strokeWidth = 14
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Color palette matching iOS System Colors
  const isPass = clampedScore >= 80;
  const isReview = clampedScore >= 50 && clampedScore < 80;

  const primaryColor = isPass
    ? '#34C759' // iOS System Green
    : isReview
    ? '#FF9500' // iOS System Orange
    : '#FF3B30'; // iOS System Red

  const secondaryColor = isPass
    ? '#30D158'
    : isReview
    ? '#FFB340'
    : '#FF453A';

  const glowColor = isPass
    ? 'rgba(52, 199, 89, 0.25)'
    : isReview
    ? 'rgba(255, 149, 0, 0.25)'
    : 'rgba(255, 59, 48, 0.25)';

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clean redraw

    const width = size;
    const height = size;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius - strokeWidth;
    const outerRadius = radius;

    // We configure a 250-degree radial sweep (-125° to +125°)
    const startAngle = -Math.PI * 0.75;
    const endAngle = Math.PI * 0.75;
    const totalAngle = endAngle - startAngle;

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Define unique gradient IDs
    const defs = svg.append('defs');
    const gradientId = `gauge-gradient-${Math.random().toString(36).substring(2, 9)}`;
    const filterId = `gauge-glow-${Math.random().toString(36).substring(2, 9)}`;

    // Linear Gradient along the stroke
    const linearGradient = defs
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    linearGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', primaryColor);

    linearGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', secondaryColor);

    // Subtle drop shadow filter for iOS depth
    const filter = defs
      .append('filter')
      .attr('id', filterId)
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');

    filter
      .append('feDropShadow')
      .attr('dx', 0)
      .attr('dy', 2)
      .attr('stdDeviation', 4)
      .attr('flood-color', glowColor);

    // D3 Arc Generator for Track & Foreground
    const arcGenerator = d3
      .arc<void>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(strokeWidth / 2);

    // 1. Background Track Arc (Dark iOS elevated surface)
    g.append('path')
      .attr('d', arcGenerator({
        startAngle,
        endAngle,
        innerRadius,
        outerRadius
      } as any))
      .attr('fill', '#2c2c2e')
      .attr('opacity', 0.9);

    // 2. Micro Tick marks around the track
    const tickCount = 20;
    const tickData = d3.range(tickCount + 1);
    const tickScale = d3.scaleLinear().domain([0, tickCount]).range([startAngle, endAngle]);

    tickData.forEach((d) => {
      const angle = tickScale(d);
      const isMajor = d % 5 === 0;
      const tickInner = innerRadius - (isMajor ? 6 : 3);
      const tickOuter = innerRadius - 1;

      const x1 = Math.sin(angle) * tickInner;
      const y1 = -Math.cos(angle) * tickInner;
      const x2 = Math.sin(angle) * tickOuter;
      const y2 = -Math.cos(angle) * tickOuter;

      g.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', isMajor ? '#636366' : '#3a3a3c')
        .attr('stroke-width', isMajor ? 1.5 : 1)
        .attr('stroke-linecap', 'round');
    });

    // 3. Foreground Active Value Arc with D3 animation
    const progressAngle = startAngle + (clampedScore / 100) * totalAngle;

    if (clampedScore > 0) {
      const foregroundPath = g
        .append('path')
        .attr('fill', `url(#${gradientId})`)
        .attr('filter', `url(#${filterId})`);

      // D3 Transition Interpolation
      foregroundPath
        .transition()
        .duration(850)
        .ease(d3.easeCubicOut)
        .attrTween('d', () => {
          const interpolate = d3.interpolate(startAngle, progressAngle);
          return (t) => {
            return arcGenerator({
              startAngle,
              endAngle: interpolate(t),
              innerRadius,
              outerRadius
            } as any) || '';
          };
        });

      // Indicator Dot at End of Progress
      const endX = Math.sin(progressAngle) * ((innerRadius + outerRadius) / 2);
      const endY = -Math.cos(progressAngle) * ((innerRadius + outerRadius) / 2);

      g.append('circle')
        .attr('cx', endX)
        .attr('cy', endY)
        .attr('r', (strokeWidth / 2) - 1.5)
        .attr('fill', '#ffffff')
        .attr('opacity', 0)
        .transition()
        .delay(700)
        .duration(300)
        .attr('opacity', 1);
    }
  }, [clampedScore, primaryColor, secondaryColor, glowColor, size, strokeWidth]);

  return (
    <div className="relative inline-flex flex-col items-center justify-center select-none">
      <svg
        ref={svgRef}
        width={size}
        height={size}
        className="overflow-visible block"
        aria-label={`Authenticity Score Gauge: ${clampedScore} percent`}
      />

      {/* Centered iOS Typography Overlaid over Arc */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-2"
        style={{ width: size, height: size }}
      >
        <div className="flex items-baseline justify-center">
          <span 
            className="font-bold tracking-tight text-white font-sans tabular-nums"
            style={{ 
              fontSize: size >= 180 ? '2.75rem' : '2.1rem',
              lineHeight: 1,
              letterSpacing: '-0.03em'
            }}
          >
            {clampedScore}
          </span>
          <span 
            className="text-white/60 font-semibold ml-0.5"
            style={{ fontSize: size >= 180 ? '1.25rem' : '1rem' }}
          >
            %
          </span>
        </div>

        <span className="text-[10px] uppercase font-semibold tracking-widest text-zinc-400 mt-1">
          Authenticity
        </span>

        {/* Small Status Pill under score */}
        <div 
          className="mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide flex items-center gap-1.5 shadow-sm"
          style={{
            backgroundColor: isPass ? 'rgba(52, 199, 89, 0.15)' : isReview ? 'rgba(255, 149, 0, 0.15)' : 'rgba(255, 59, 48, 0.15)',
            color: primaryColor,
            border: `1px solid ${isPass ? 'rgba(52, 199, 89, 0.3)' : isReview ? 'rgba(255, 149, 0, 0.3)' : 'rgba(255, 59, 48, 0.3)'}`
          }}
        >
          <span 
            className="w-1.5 h-1.5 rounded-full" 
            style={{ backgroundColor: primaryColor }} 
          />
          <span>{decision || (isPass ? 'PASS' : isReview ? 'REVIEW' : 'REJECT')}</span>
        </div>
      </div>
    </div>
  );
};
