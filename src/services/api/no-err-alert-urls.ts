const noErrAlertUrls = [
  'Product/GetProductById',
  'Box/GenerateBarCode',
]

export const checkUrlAlertException = (url: string): boolean => {
  return !noErrAlertUrls.filter(row => url.includes(row))[0]
}
