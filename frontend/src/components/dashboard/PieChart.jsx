import './PieChart.css';

const polarToCartesian = (cx, cy, r, angleDeg) => {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
};

const describeSlice = (cx, cy, r, startAngle, endAngle) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
};

/**
 * data: [{ label, value, color }]
 */
const PieChart = ({ data, size = 200 }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  let cursor = 0;
  const slices = data.map((d) => {
    const fraction = total === 0 ? 0 : d.value / total;
    const startAngle = cursor * 360;
    const endAngle = (cursor + fraction) * 360;
    cursor += fraction;
    return { ...d, startAngle, endAngle, fraction };
  });

  return (
    <div className="pie-chart">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="pie-chart__svg">
        {total === 0 ? (
          <circle cx={cx} cy={cy} r={r - 1} className="pie-chart__empty" />
        ) : (
          slices.map((slice, i) =>
            slice.fraction > 0 ? (
              slice.fraction >= 0.999 ? (
                <circle key={i} cx={cx} cy={cy} r={r - 1} fill={slice.color} />
              ) : (
                <path key={i} d={describeSlice(cx, cy, r - 1, slice.startAngle, slice.endAngle)} fill={slice.color} />
              )
            ) : null
          )
        )}
        <circle cx={cx} cy={cy} r={r * 0.55} className="pie-chart__hole" />
        <text x={cx} y={cy - 4} textAnchor="middle" className="pie-chart__total-value">
          {total}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" className="pie-chart__total-label">
          tareas
        </text>
      </svg>

      <ul className="pie-chart__legend">
        {data.map((d) => (
          <li key={d.label} className="pie-chart__legend-item">
            <span className="pie-chart__dot" style={{ background: d.color }} />
            <span className="pie-chart__legend-label">{d.label}</span>
            <span className="pie-chart__legend-value">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PieChart;
