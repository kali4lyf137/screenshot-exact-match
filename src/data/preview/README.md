# Preview data

Everything in this folder is **fictional sample data** for the design prototype.
It is not production restaurant data and is never sent anywhere.
Only `src/integrations/meyo/preview-adapter.ts` may import from here; screens
receive data through the integration contracts so the adapter can be swapped
for the real Meyo API.
