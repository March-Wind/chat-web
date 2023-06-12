import React, { FC, useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import dotparser from 'dotparser';
// const dotCode = `
//     digraph G {
//       A [label="Node A"];
//       B [label="Node B"];
//       C [label="Node C"];
//       A -> B;
//       B -> C;
//       C -> A;
//     }
//   `;
// 导入Cytoscape.js样式
// import 'cytoscape/dist/cytoscape.min.css';
interface Props {
  dotCode: string;
}
const DotEditor: FC<Props> = (props) => {
  const { dotCode } = props;
  const cyRef = useRef(null);

  useEffect(() => {
    // 解析DOT语言
    const dotAST = dotparser(dotCode);

    // 转换为Cytoscape.js的元素数据格式
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const elements = dotAST[0].stmt_list.map((stmt) => {
      if (stmt.type === 'node_stmt') {
        const node = stmt.node_id.id;
        return {
          data: {
            id: node,
            label: node,
          },
        };
      } else if (stmt.type === 'edge_stmt') {
        const source = stmt.edge_list[0].id;
        const target = stmt.edge_list[1].id;
        return {
          data: {
            id: `${source}-${target}`,
            source,
            target,
          },
        };
      }
    });

    // 初始化Cytoscape实例
    const cy = cytoscape({
      container: cyRef.current,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      style: cytoscape.stylesheet()
        .selector('node')
        .style({
          'background-color': '#666',
          label: 'data(label)',
        })
        .selector('edge')
        .style({
          width: 2,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
        }),
      layout: {
        name: 'grid',
        rows: 1,
      },
      elements,
    });

    return () => {
      cy.destroy();
    };
  }, [dotCode]);

  return <div ref={cyRef} style={{ width: '100%', height: '400px' }} />;
};

export default DotEditor;
