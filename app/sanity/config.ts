import {createConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {dashboardTool, projectUsersWidget, projectInfoWidget} from '@sanity/dashboard'

import schema from './schema'
import {structure, defaultDocumentNode} from './structure'

export const projectDetails = () => ({
  projectId:
    typeof document === 'undefined' ? process.env.SANITY_PROJECT_ID : window?.ENV?.projectId,
  dataset: typeof document === 'undefined' ? process.env.SANITY_DATASET : window?.ENV?.dataset,
  apiVersion:
    typeof document === 'undefined' ? process.env.SANITY_API_VERSION : window?.ENV?.apiVersion,
})

export const config = createConfig({
  name: 'default',
  title: 'Workshop Sanity',
  ...projectDetails(),
  plugins: [
    deskTool({
      structure,
      defaultDocumentNode,
    }),
    dashboardTool({
      widgets: [projectUsersWidget(), projectInfoWidget()],
    }),
    // visionTool(),
    // media()
  ],
  basePath: `/studio`,
  schema: {
    types: schema,
  },
  badges: (prev, context) => {
    if (context.schemaType === `product`) {
      return [
        ...prev,
        {
          label: `Luxury`,
          title: `This is a luxury product`,
          color: `primary`,
        },
      ]
    }

    return prev
  },
})
