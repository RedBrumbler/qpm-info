<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/RedBrumbler/qpm-info/workflows/build-test/badge.svg"></a>
</p>

## QPM info Github Action

This is an action to provide some of the information in the qpm json to a github actions workflow

Usage:

```yaml
- name: Get QPM info
  uses: RedBrumbler/qpm-info@v1
  id: qpm-info
  with:
    # optional
    package_path: "qpm.json"
    shared: false
```
The outputs of the action are as follows:

| identifier  | content         |
|-------------|-----------------|
| name        | package name    |
| id          | package id      |
| url         | package url     |
| version     | package version |

An example of how to access these:

```yaml
- name: Print info
  runs: |
    echo "Name: ${{ steps.qpm-info.outputs.name }}
    echo "Id: ${{ steps.qpm-info.outputs.id }}
    echo "Url: ${{ steps.qpm-info.outputs.url }}
    echo "Version: ${{ steps.qpm-info.outputs.version }}
```
