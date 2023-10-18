import React, { useState } from 'react';
import { Box } from 'coral-system';
import { Button, Space } from 'antd';
import {
  ApiOutlined,
  AppstoreAddOutlined,
  BuildOutlined,
  ClusterOutlined,
  FunctionOutlined,
} from '@ant-design/icons';
import {
  Designer,
  DesignerPanel,
  SettingPanel,
  Sidebar,
  Toolbar,
  WorkspacePanel,
  WorkspaceView,
  CodeEditor,
  Sandbox,
  DndQuery,
} from '@music163/tango-designer';
import { createEngine, Workspace } from '@music163/tango-core';
import { sampleFiles } from '../mock/project';
import { Logo, ProjectDetail, bootHelperVariables } from './share';
import './index.less';

// 1. 实例化工作区
const workspace = new Workspace({
  entry: '/src/pages/index',
  files: sampleFiles,
});


// 2. 引擎初始化
{/* @ts-ignore */}
const engine = createEngine({ workspace });

// @ts-ignore
window.__workspace__ = workspace;

// 拖拽引擎的初始化
const sandboxQuery = new DndQuery({
  context: 'iframe',
});


/**
 * 3. 平台初始化，访问 https://local.netease.com:6006/
 */
export default function App() {
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuData, setMenuData] = useState(false);

  return (
    <Designer
      engine={engine}
      config={{
        customActionVariables: bootHelperVariables,
        customExpressionVariables: bootHelperVariables,
      }}
      sandboxQuery={sandboxQuery}
    >
      <DesignerPanel
        logo={<Logo />}
        description={<ProjectDetail />}
        actions={
          <Box px="l">
            <Toolbar>
              <Toolbar.Item key="routeSwitch" placement="left" />
              <Toolbar.Item key="preview" placement="left" />
              <Toolbar.Item key="modeSwitch" placement="right" />
              <Toolbar.Item key="togglePanel" placement="right" />
              <Toolbar.Separator />
              <Toolbar.Item placement="right">
                <Space>
                  <Button type="primary">发布</Button>
                </Space>
              </Toolbar.Item>
            </Toolbar>
          </Box>
        }
      >
        <Sidebar>
          <Sidebar.Item key="outline" label="结构" icon={<BuildOutlined />} />
          <Sidebar.Item
            key="components"
            label="组件"
            icon={<AppstoreAddOutlined />}
            widgetProps={{
              menuData: menuData as any,
              loading: menuLoading,
            }}
          />
          <Sidebar.Item
            key="variables"
            label="变量"
            icon={<FunctionOutlined />}
            isFloat
            width={800}
          />
          <Sidebar.Item key="dataSource" label="接口" icon={<ApiOutlined />} isFloat width={800} />
          <Sidebar.Item
            key="dependency"
            label="依赖"
            icon={<ClusterOutlined />}
            isFloat
            width={800}
          />
        </Sidebar>
        <WorkspacePanel>
          <WorkspaceView mode="design">
            <Sandbox
              onMessage={(e) => {
                if (e.type === 'done') {
                  const sandboxWindow: any = sandboxQuery.window;
                  if (sandboxWindow.TangoAntd) {
                    if (sandboxWindow.TangoAntd.menuData) {
                      setMenuData(sandboxWindow.TangoAntd.menuData);
                    }
                    if (sandboxWindow.TangoAntd.prototypes) {
                      workspace.setComponentPrototypes(sandboxWindow.TangoAntd.prototypes);
                    }
                  }
                  setMenuLoading(false);
                }
              }}
            />
          </WorkspaceView>
          <WorkspaceView mode="code">
            <CodeEditor />
          </WorkspaceView>
        </WorkspacePanel>
        <SettingPanel />
      </DesignerPanel>
    </Designer>
  );
}
