import React, {SyntheticEvent} from 'react'
import {SanityDocumentLike, useClient, useSchema} from 'sanity'
import {Stack, Button, Card, Flex, Text, TextInput, useToast, Grid, Box} from '@sanity/ui'
import _ from 'lodash'
import {faker} from '@faker-js/faker'
import {CheckmarkCircleIcon, CircleIcon, DocumentsIcon} from '@sanity/icons'
import Field from './Field'
import {generateFakeImage} from '../generators/image'

type Manifest = {
  [key: string]: {
    count: number
    fields: {
      [key: string]: any
    }
  }
}
export default function Faker() {
  const client = useClient()
  const toast = useToast()
  const schema = useSchema()

  const documentTypes = React.useMemo(() => {
    const schemaTypes = schema?._original?.types ?? []
    return schemaTypes.filter(({type, name}) => type === 'document' && !name.startsWith('sanity.'))
  }, [schema?._original?.types])
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>(
    documentTypes.map((type) => type.name)
  )
  const [manifest, setManifest] = React.useState<Manifest>({})
  const [deleteExisting, setDeleteExisting] = React.useState<Boolean>(false)
  const [faking, setFaking] = React.useState<Boolean>(false)

  const handleSelectType = React.useCallback((e: SyntheticEvent<HTMLButtonElement>) => {
    const {value} = e.currentTarget
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    )
  }, [])

  const handleUpdateCount = React.useCallback(
    (e: SyntheticEvent<HTMLInputElement>) => {
      const {name, value} = e.currentTarget
      const path = [name, `count`]

      const newManifest = value
        ? _.set(manifest, path, parseInt(value, 10))
        : _.omit(manifest, path)

      setManifest({...newManifest})
    },
    [manifest]
  )

  const handleCheckbox = React.useCallback(
    (e: SyntheticEvent<HTMLInputElement>) => {
      const newManifest = {...manifest}
      const {name, value} = e.currentTarget
      const [typeName, ...rest] = name.split(',')
      const lastKey = [...name.split(',')].pop()
      const path = [typeName, 'fields', ...rest]

      // Toggle-off the whole object if this is a checkbox
      const currentValueToToggle =
        (lastKey === 'type' || lastKey === 'types') && _.get(newManifest, path, undefined)

      // Key already has a value
      if (currentValueToToggle) {
        if (lastKey === `types`) {
          if (currentValueToToggle.includes(value)) {
            // Remove just this item in the array
            _.set(
              newManifest,
              path,
              currentValueToToggle.filter((v: string) => v !== value)
            )
          } else {
            // Add new item to the array
            _.set(newManifest, path, [...currentValueToToggle, value])
          }

          // Unset if array is now empty
          if (_.get(newManifest, path, []).length === 0) {
            _.unset(newManifest, path)
          }
        } else {
          // Remove entirely
          _.unset(newManifest, path.slice(0, -1))
        }

        // Remove any now-empty types
        Object.keys(newManifest).forEach((type) => {
          // Empty `fields` key
          if (!Object.keys(newManifest[type].fields).length) {
            _.unset(newManifest, [type, `fields`])
          }

          // Empty type
          if (!Object.keys(newManifest[type]).length) {
            _.unset(newManifest, [type])
          }
        })
      } else if (lastKey === `types`) {
        // Set initial `types` array
        _.set(newManifest, path, [value])
      } else {
        // Set initial string value
        _.set(newManifest, path, value)
      }

      return setManifest(newManifest)
    },
    [manifest]
  )

  const handleGenerate = React.useCallback(async () => {
    const data: {[key: string]: SanityDocumentLike[]} = {}
    setFaking(true)
    toast.push({
      closable: true,
      status: 'info',
      title: 'Generating fake data',
      description: 'This may take a while...',
    })

    // Create fake data stubs first, in case we need to create references
    Object.keys(manifest).forEach((type) => {
      data[type] = []

      for (let index = 0; index < manifest[type].count; index++) {
        data[type].push({_id: faker.datatype.uuid(), _type: type})
      }
    })

    // Now fill those documents with fake data
    for await (const type of Object.keys(manifest)) {
      for (let index = 0; index < manifest[type].count; index++) {
        let doc = data[type][index]

        // For loop for async-ness
        for await (const field of Object.keys(manifest[type].fields)) {
          switch (manifest[type].fields[field].type) {
            case 'image':
              {
                const imageField = await generateFakeImage({client})

                doc = _.set(doc, field, imageField)
              }
              break
            case 'string':
              doc = _.set(doc, field, faker.commerce.productName())
              break
            case 'slug':
              doc = _.set(
                doc,
                [field, 'current'],
                faker.commerce
                  .productName()
                  .split(` `)
                  .map((w) => w.toLowerCase())
                  .join(`-`)
              )
              break
            case 'number':
              doc = _.set(
                doc,
                field,
                parseInt(
                  faker.commerce.price(
                    manifest[type].fields[field]?.min ?? undefined,
                    manifest[type].fields[field]?.max ?? undefined,
                    0
                  ),
                  10
                )
              )
              break
            case 'reference':
              {
                // Get random document of the referenced type
                const referenceTypes: string[] = manifest[type].fields[field]?.to
                  ? Object.keys(manifest[type].fields[field]?.to)
                  : []

                // Pick a random type
                const targetType = _.sample(referenceTypes)

                // Pick a random document of that type
                const targetDoc = targetType ? _.sample(data[targetType]) : null

                if (targetDoc) {
                  doc = _.set(doc, field, {
                    _type: 'reference',
                    _ref: targetDoc._id,
                  })
                }
              }
              break
            case 'array':
              {
                const items: any[] = []

                if (manifest[type].fields[field]?.types?.length) {
                  const itemsCount = parseInt(
                    faker.commerce.price(
                      manifest[type].fields[field]?.min ?? 1,
                      manifest[type].fields[field]?.max ?? 3,
                      0
                    ),
                    10
                  )

                  for (let itemsIndex = 0; itemsIndex < itemsCount; itemsIndex++) {
                    let newItem = {
                      _type: _.sample(manifest[type].fields[field]?.types),
                      _key: faker.datatype.uuid().split(`-`)[0],
                    }

                    if (newItem._type === `block`) {
                      newItem = {
                        ...newItem,
                        // @ts-ignore
                        style: 'normal',
                        markDefs: [],
                        children: [
                          {
                            _type: 'span',
                            _key: faker.datatype.uuid().split(`-`)[0],
                            text: faker.lorem.paragraph(),
                            marks: [],
                          },
                        ],
                      }
                    } else if (newItem._type === `image`) {
                      newItem = {
                        ...newItem,
                        ...(await generateFakeImage({client})),
                      }
                    }

                    items.push(newItem)
                  }
                }

                doc = _.set(doc, field, items)
              }
              break
            default:
              break
          }
        }

        data[type][index] = doc
      }
    }

    // Delete existing documents
    if (deleteExisting) {
      await client.delete({query: `*[_type in $types]`, params: {types: Object.keys(manifest)}})
    }

    const transaction = client.transaction()
    Object.keys(data).forEach((type) => data[type].forEach((doc) => transaction.create(doc)))

    transaction
      .commit()
      .then((res) => {
        toast.push({
          status: 'success',
          title: 'Success',
          description: `Created ${res.results.length} documents`,
        })
        setFaking(false)
        setManifest({})
      })
      .catch((err) => {
        console.error(err)

        toast.push({
          status: 'error',
          title: 'Error',
          description: err.message,
        })
        setFaking(false)
      })
  }, [deleteExisting, client, manifest, toast])

  const generateCount = React.useMemo(
    () => Object.keys(manifest).reduce((acc, type) => manifest?.[type]?.count ?? 0 + acc, 0),
    [manifest]
  )

  return (
    <Grid gap={4} columns={2} padding={4}>
      <Stack space={2}>
        <Flex gap={2}>
          {documentTypes.map((type) => (
            <Button
              tone="primary"
              mode={selectedTypes.includes(type.name) ? `default` : `ghost`}
              key={type.name}
              text={type?.title ?? type.name}
              icon={type.icon}
              onClick={handleSelectType}
              value={type.name}
              fontSize={1}
              padding={2}
            />
          ))}

          <Flex justify="flex-end" align="center" flex={1} gap={2}>
            <Button
              text="Delete Existing"
              tone="critical"
              icon={deleteExisting ? CheckmarkCircleIcon : CircleIcon}
              mode={deleteExisting ? `default` : `ghost`}
              onClick={() => setDeleteExisting(!deleteExisting)}
              disabled={Boolean(faking || Object.keys(manifest).length < 1)}
              fontSize={1}
              padding={2}
            />
            <Button
              text="Fake it!"
              icon={DocumentsIcon}
              tone="positive"
              onClick={handleGenerate}
              disabled={Boolean(faking || generateCount < 1)}
              fontSize={1}
              padding={2}
            />
          </Flex>
        </Flex>

        {documentTypes
          .filter((type) => selectedTypes.includes(type.name))
          .map((type) => (
            <Card key={type.name} padding={4} tone="primary" border radius={2}>
              <Stack space={3}>
                <Flex align="center" gap={2}>
                  <Text>Create</Text>
                  <TextInput
                    style={{width: 100}}
                    name={type.name}
                    onChange={handleUpdateCount}
                    placeholder="Count"
                  />
                  <Box flex={1}>
                    <Text weight="medium">{type?.title ?? type.name} Document(s)</Text>
                  </Box>
                </Flex>

                <Text muted size={1}>
                  Fields:
                </Text>
                <Stack space={2}>
                  {/* @ts-ignore */}
                  {type.fields.length > 0
                    ? // @ts-ignore
                      type.fields.map((field: any) => (
                        <Field
                          key={field.name}
                          manifest={manifest}
                          field={field}
                          type={type}
                          handleCheckbox={handleCheckbox}
                        />
                      ))
                    : null}
                </Stack>
              </Stack>
            </Card>
          ))}
      </Stack>
      <Card padding={4} tone="caution" border radius={2}>
        <pre>{JSON.stringify(manifest, null, 2)}</pre>
      </Card>
    </Grid>
  )
}
