const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const componentFolderName = process.argv[2];
const componentName = `${componentFolderName.charAt(0).toUpperCase()}${componentFolderName
    .slice(1)
    .replace(/-([a-z])/g, g => g[1].toUpperCase())}`;

const folderName = `./src/components/${componentFolderName}`;

const writeFile = (filename, contents) => {
    const pathName = path.join(folderName, filename);

    fs.writeFile(pathName, `${contents}`, (err) => {
        if (err) {
            return console.log(err);
        }
        console.log(`Created file: ${pathName}`);
    });
};

// write component.tsx file
const componentScript = () => {
    const filename = `${componentFolderName}.tsx`;
    const contents = `import React from 'react';
import styled from 'styled-components';

export interface ${componentName}Props {
    children: React.ReactNode;
    exampleProp?: boolean;
}

const Styled${componentName} = styled.div\`
    border: 1px solid red;
    padding: 12px;
\`;

export const ${componentName} = React.forwardRef<HTMLDivElement, ${componentName}Props>(({ children, exampleProp, ...props }, ref) => (
    <Styled${componentName} ref={ref} {...props}>
        {children} {' : '} {exampleProp ? '🌭' : '🍔'}
    </Styled${componentName}>
));

${componentName}.defaultProps = {};
`;
    writeFile(filename, contents);
};

// write index file
const indexScript = () => {
    const filename = `index.ts`;
    const contents = `export * from './${componentFolderName}';
`;
    writeFile(filename, contents);
};

// write stories.js file
const storiesScript = () => {
    const filename = 'stories.tsx';
    const contents = `import React from 'react';
import { Story } from '@storybook/react/types-6-0';

import { ${componentName} as ${componentName}Story, ${componentName}Props } from './';

export default {
    title: '${componentName}',
    component: ${componentName}Story,
};

const Template: Story<${componentName}Props> = (args) => <${componentName}Story {...args}>example</${componentName}Story>;

export const ${componentName} = Template.bind({});
${componentName}.args = {
    exampleProp: false,
};
`;
    writeFile(filename, contents);
};

// write test file
const testScript = () => {
    const filename = `${componentFolderName}.test.tsx`;
    const contents = `import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { ${componentName} } from './';

describe('${componentName}', () => {
    describe('basics', () => {
        it('should render a ${componentName}', () => {
            const wrapper = mount(<${componentName}>example</${componentName}>);

            expect(wrapper.find('${componentName}')).toBeTruthy();
        });

        it('matches snapshot', () => {
            const wrapper = renderer.create(<${componentName}>example</${componentName}>).toJSON();

            expect(wrapper).toMatchSnapshot();
        });
    });
});
`;
    writeFile(filename, contents);
};

const init = () => {
    if (fs.existsSync(path.join(folderName))) {
        console.log(`❗️❗️ The component '${componentName}' already exists ❗️❗️
Please use a different name or delete the existing folder 🆗`);
    }
    mkdirp(folderName).then(() => {
        componentScript();
        indexScript();
        storiesScript();
        testScript();
        console.log(`✅  The component '${componentName}' was created successfully`); //eslint-disable-line
    });
};

init();
