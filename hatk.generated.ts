// Auto-generated from lexicons. Do not edit.
import type { LexProcedure, LexQuery, LexServerParams, Checked, Prettify, StrictArg } from '@hatk/hatk/lex-types'
import type { XrpcContext } from '@hatk/hatk/xrpc'
import { callXrpc as _callXrpc } from '@hatk/hatk/xrpc'
import { defineFeed as _defineFeed, type FeedResult, type FeedContext, type BaseContext, type Row } from '@hatk/hatk/feeds'
import { seed as _seed, type SeedOpts } from '@hatk/hatk/seed'

// ─── Lexicon Definitions ────────────────────────────────────────────

const createRecordLex = {"lexicon":1,"id":"dev.hatk.createRecord","defs":{"main":{"type":"procedure","description":"Create a record via the user's PDS.","input":{"encoding":"application/json","schema":{"type":"object","required":["collection","repo","record"],"properties":{"collection":{"type":"string"},"repo":{"type":"string","format":"did"},"record":{"type":"unknown"}}}},"output":{"encoding":"application/json","schema":{"type":"object","properties":{"uri":{"type":"string","format":"at-uri"},"cid":{"type":"string","format":"cid"}}}}}}} as const
const deleteRecordLex = {"lexicon":1,"id":"dev.hatk.deleteRecord","defs":{"main":{"type":"procedure","description":"Delete a record via the user's PDS.","input":{"encoding":"application/json","schema":{"type":"object","required":["collection","rkey"],"properties":{"collection":{"type":"string"},"rkey":{"type":"string"}}}},"output":{"encoding":"application/json","schema":{"type":"object","properties":{}}}}}} as const
const describeCollectionsLex = {"lexicon":1,"id":"dev.hatk.describeCollections","defs":{"main":{"type":"query","description":"List indexed collections and their schemas.","output":{"encoding":"application/json","schema":{"type":"object","properties":{"collections":{"type":"array","items":{"type":"object","required":["collection"],"properties":{"collection":{"type":"string"},"columns":{"type":"array","items":{"type":"object","required":["name","originalName","type","required"],"properties":{"name":{"type":"string"},"originalName":{"type":"string"},"type":{"type":"string"},"required":{"type":"boolean"}}}}}}}}}}}}} as const
const describeFeedsLex = {"lexicon":1,"id":"dev.hatk.describeFeeds","defs":{"main":{"type":"query","description":"List available feeds.","output":{"encoding":"application/json","schema":{"type":"object","properties":{"feeds":{"type":"array","items":{"type":"object","required":["name","label"],"properties":{"name":{"type":"string"},"label":{"type":"string"}}}}}}}}}} as const
const describeLabelsLex = {"lexicon":1,"id":"dev.hatk.describeLabels","defs":{"main":{"type":"query","description":"List available label definitions.","output":{"encoding":"application/json","schema":{"type":"object","properties":{"definitions":{"type":"array","items":{"type":"object","required":["identifier","severity","blurs","defaultSetting"],"properties":{"identifier":{"type":"string"},"severity":{"type":"string"},"blurs":{"type":"string"},"defaultSetting":{"type":"string"}}}}}}}}}} as const
const getFeedLex = {"lexicon":1,"id":"dev.hatk.getFeed","defs":{"main":{"type":"query","description":"Retrieve a named feed of items.","parameters":{"type":"params","required":["feed"],"properties":{"feed":{"type":"string","description":"Feed name"},"limit":{"type":"integer","minimum":1,"maximum":100,"default":30},"cursor":{"type":"string"}}},"output":{"encoding":"application/json","schema":{"type":"object","required":["items"],"properties":{"items":{"type":"array","items":{"type":"unknown"}},"cursor":{"type":"string"}}}}}}} as const
const getRecordLex = {"lexicon":1,"id":"dev.hatk.getRecord","defs":{"main":{"type":"query","description":"Fetch a single record by AT URI.","parameters":{"type":"params","required":["uri"],"properties":{"uri":{"type":"string","format":"at-uri"}}},"output":{"encoding":"application/json","schema":{"type":"object","properties":{"record":{"type":"unknown"}}}}}}} as const
const getRecordsLex = {"lexicon":1,"id":"dev.hatk.getRecords","defs":{"main":{"type":"query","description":"List records from a collection with optional filters.","parameters":{"type":"params","required":["collection"],"properties":{"collection":{"type":"string"},"limit":{"type":"integer","minimum":1,"maximum":100,"default":20},"cursor":{"type":"string"},"sort":{"type":"string"},"order":{"type":"string"}}},"output":{"encoding":"application/json","schema":{"type":"object","required":["items"],"properties":{"items":{"type":"array","items":{"type":"unknown"}},"cursor":{"type":"string"}}}}}}} as const
const putRecordLex = {"lexicon":1,"id":"dev.hatk.putRecord","defs":{"main":{"type":"procedure","description":"Create or update a record via the user's PDS.","input":{"encoding":"application/json","schema":{"type":"object","required":["collection","rkey","record"],"properties":{"collection":{"type":"string"},"rkey":{"type":"string"},"record":{"type":"unknown"},"repo":{"type":"string","format":"did"}}}},"output":{"encoding":"application/json","schema":{"type":"object","properties":{"uri":{"type":"string","format":"at-uri"},"cid":{"type":"string","format":"cid"}}}}}}} as const
const searchRecordsLex = {"lexicon":1,"id":"dev.hatk.searchRecords","defs":{"main":{"type":"query","description":"Full-text search across a collection.","parameters":{"type":"params","required":["collection","q"],"properties":{"collection":{"type":"string"},"q":{"type":"string","description":"Search query"},"limit":{"type":"integer","minimum":1,"maximum":100,"default":20},"cursor":{"type":"string"},"fuzzy":{"type":"boolean","default":true}}},"output":{"encoding":"application/json","schema":{"type":"object","required":["items"],"properties":{"items":{"type":"array","items":{"type":"unknown"}},"cursor":{"type":"string"}}}}}}} as const
const uploadBlobLex = {"lexicon":1,"id":"dev.hatk.uploadBlob","defs":{"main":{"type":"procedure","description":"Upload a blob via the user's PDS.","input":{"encoding":"*/*"},"output":{"encoding":"application/json","schema":{"type":"object","required":["blob"],"properties":{"blob":{"type":"blob"}}}}}}} as const

// ─── Type Registry ──────────────────────────────────────────────────

type Registry = {
  'dev.hatk.createRecord': typeof createRecordLex
  'dev.hatk.deleteRecord': typeof deleteRecordLex
  'dev.hatk.describeCollections': typeof describeCollectionsLex
  'dev.hatk.describeFeeds': typeof describeFeedsLex
  'dev.hatk.describeLabels': typeof describeLabelsLex
  'dev.hatk.getFeed': typeof getFeedLex
  'dev.hatk.getRecord': typeof getRecordLex
  'dev.hatk.getRecords': typeof getRecordsLex
  'dev.hatk.putRecord': typeof putRecordLex
  'dev.hatk.searchRecords': typeof searchRecordsLex
  'dev.hatk.uploadBlob': typeof uploadBlobLex
}

// ─── Record & Method Types ──────────────────────────────────────────

export type DescribeCollections = Prettify<LexQuery<typeof describeCollectionsLex, Registry>>
export type DescribeFeeds = Prettify<LexQuery<typeof describeFeedsLex, Registry>>
export type DescribeLabels = Prettify<LexQuery<typeof describeLabelsLex, Registry>>
export type GetFeed = Prettify<LexQuery<typeof getFeedLex, Registry>>
export type GetRecord = Prettify<LexQuery<typeof getRecordLex, Registry>>
export type GetRecords = Prettify<LexQuery<typeof getRecordsLex, Registry>>
export type SearchRecords = Prettify<LexQuery<typeof searchRecordsLex, Registry>>
export type UploadBlob = Prettify<LexProcedure<typeof uploadBlobLex, Registry>>

export type RecordRegistry = {}

export type CreateRecord = LexProcedure<typeof createRecordLex, Registry>
export type DeleteRecord = LexProcedure<typeof deleteRecordLex, Registry>
export type PutRecord = LexProcedure<typeof putRecordLex, Registry>

// ─── Named Defs (Views, Objects) ────────────────────────────────────


// ─── XRPC Schema ────────────────────────────────────────────────────

export type XrpcSchema = {
  'dev.hatk.createRecord': CreateRecord
  'dev.hatk.deleteRecord': DeleteRecord
  'dev.hatk.describeCollections': DescribeCollections
  'dev.hatk.describeFeeds': DescribeFeeds
  'dev.hatk.describeLabels': DescribeLabels
  'dev.hatk.getFeed': GetFeed
  'dev.hatk.getRecord': GetRecord
  'dev.hatk.getRecords': GetRecords
  'dev.hatk.putRecord': PutRecord
  'dev.hatk.searchRecords': SearchRecords
  'dev.hatk.uploadBlob': UploadBlob
}

// ─── XRPC Helpers ───────────────────────────────────────────────────

export type { BaseContext, Row } from '@hatk/hatk/feeds'
export { InvalidRequestError, NotFoundError } from '@hatk/hatk/xrpc'
export { defineSetup } from '@hatk/hatk/setup'
export { defineHook } from '@hatk/hatk/hooks'
export { defineLabel } from '@hatk/hatk/labels'
export { defineOG } from '@hatk/hatk/opengraph'
export { defineRenderer } from '@hatk/hatk/renderer'
export type Ctx<K extends keyof XrpcSchema & keyof Registry> = XrpcContext<
  LexServerParams<Registry[K], Registry>,
  RecordRegistry,
  K extends keyof XrpcSchema ? InputOf<K> : unknown
>

type OutputOf<K extends keyof XrpcSchema> = XrpcSchema[K]['output']
type InputOf<K extends keyof XrpcSchema> = XrpcSchema[K] extends { input: infer I } ? I : unknown

export function defineQuery<K extends keyof XrpcSchema & string>(
  nsid: K,
  handler: (ctx: Ctx<K> & { ok: <T extends OutputOf<K>>(value: StrictArg<T, OutputOf<K>>) => Checked<OutputOf<K>> }) => Promise<Checked<OutputOf<K>>>,
) {
  return { __type: 'query' as const, nsid, handler: (ctx: any) => handler({ ...ctx, ok: (v: any) => v }) }
}

export function defineProcedure<K extends keyof XrpcSchema & string>(
  nsid: K,
  handler: (ctx: Ctx<K> & { ok: <T extends OutputOf<K>>(value: StrictArg<T, OutputOf<K>>) => Checked<OutputOf<K>> }) => Promise<Checked<OutputOf<K>>>,
) {
  return { __type: 'procedure' as const, nsid, handler: (ctx: any) => handler({ ...ctx, ok: (v: any) => v }) }
}

// ─── Server-side XRPC Caller ────────────────────────────────────────

type ExtractParams<T> = T extends { params: infer P } ? P : Record<string, unknown>
export async function callXrpc<K extends keyof XrpcSchema & string>(
  nsid: K,
  params?: ExtractParams<XrpcSchema[K]>,
): Promise<OutputOf<K>> {
  return _callXrpc(nsid, params as any) as Promise<OutputOf<K>>
}

// ─── Feed & Seed Helpers ────────────────────────────────────────────

type FeedGenerate = (ctx: FeedContext & { ok: (value: FeedResult) => Checked<FeedResult> }) => Promise<Checked<FeedResult>>
export function defineFeed<K extends keyof RecordRegistry>(
  opts: { collection: K; view?: string; label: string; generate: FeedGenerate; hydrate?: (ctx: BaseContext, items: Row<RecordRegistry[K]>[]) => Promise<unknown[]> }
): ReturnType<typeof _defineFeed>
export function defineFeed(
  opts: { collection?: never; view?: never; label: string; generate: FeedGenerate; hydrate: (ctx: BaseContext, items: Row<unknown>[]) => Promise<unknown[]> }
): ReturnType<typeof _defineFeed>
export function defineFeed(opts: any) { return _defineFeed(opts) }
export function seed(opts?: SeedOpts) { return _seed<RecordRegistry>(opts) }
